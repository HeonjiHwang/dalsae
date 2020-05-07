import os, socket, time, threading
import requests
from datetime import datetime
from winreg import *
from configparser import ConfigParser

def log(result1, result2):
    log = open(log_path,'at')
    if(result1 == 'ss'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 시리얼 수집성공 ( '+result2+' )\n')
    elif(result1 == 'sf'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 시리얼 수집 실패 ( '+result2+' )\n')
    elif(result1 == 's'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 데이터 수집 성공 ( '+result2+' )\n')
    elif(result1 == 'f'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 데이터 수집 실패 ( '+result2+' )\n')
    elif(result1 == 'p'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 프로세스 시작\n')
    elif(result1 == 'r'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 데이터 수집 재시작 ( '+result2+' )\n')
    elif(result1 == 'st'):
        log.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S")+ ', 데이터 수집 시작 ( '+result2+' )\n')
    log.close()
    
def dataFile(datetime,serial, data1, data2):
    f = open(data_path,'at')
    print('-------------------------------------------------------------------')
    f.write('\n------------------------------------------------------------------------------------------')
    print(datetime+'\t'+serial+'\t'+data2[0]+'\t'+data2[1]+'\t'+data2[2])
    f.write('\n'+datetime+'\t'+serial+'\t'+data2[0]+'\t'+data2[1]+'\t'+data2[2])
    f.close()
    
    
def split_str(data):
    global serial
    serial1 = data.decode()
    if(serial1 is not None and len(serial1)>0):
        serial2 = serial1.split(',')
        return serial2
    else:
        return False

def setup_conf():
    global meter_ip, meter_port, log_path, data_path
    parser = ConfigParser()
    parser.read('setup.conf')
    if(parser.has_section('SYSTEM_INFO')):
        meter_ip = parser.get('SYSTEM_INFO','meter_ip')
        meter_port = int(parser.get('SYSTEM_INFO','meter_port'))
        log_path = parser.get('SYSTEM_INFO','log_path')
        data_path = parser.get('SYSTEM_INFO','data_path')
    else:
        print('Can\'t find setup.conf')
            
def getSerial(ser):
    time1 = int(datetime.now().strftime("%S"))
    while True:
        cli_sock.settimeout(5)
        cli_sock.sendto(ser.encode(),meter_addr)
        #recv timeout check(for 15seconds)
        try:
            data, addr = cli_sock.recvfrom(1024)
        except socket.timeout:
            print("UDP recv failed. try again(timeout)")
            time2 = int(datetime.now().strftime("%S"))
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        #serial 유표성 검사 & .conf파일 생성
        serial = split_str(data)
        if(serial==False):
            print('UDP received data wrong. try again')
            time2 = int(datetime.now().strftime("%S"))
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        else:
            if(len(serial) > 2 and len(serial[1]) > 0):
                return serial[1]
    
def getData(col):
    global n1,n2,n3
    time1 = int(datetime.now().strftime("%S"))
    while True:
        cli_sock.sendto(col.encode(),meter_addr)
        cli_sock.settimeout(5)
        #recv timeout check(for 5minutes if fail getSerial())
        try:
            column_data,addr = cli_sock.recvfrom(1024)
        except socket.timeout:
            print("UDP recv failed. try again(column)")
            time2 = int(datetime.now().strftime("%S"))
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        column = split_str(column_data)
        if(column==False):
            time2 = int(datetime.now().strftime("%S"))
            print('UDP received data wrong. try again')
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        else:
            if('iPM' in column and 'SampHum()' in column and 'SampTemp()' in column):
                n1 = column.index('iPM')
                n2 = column.index('SampHum()')
                n3 = column.index('SampTemp()')
                collect[0] = column[n1]
                collect[1] = column[n2]
                collect[2] = column[n3]
                return collect
            else:
                time2 = int(datetime.now().strftime("%S"))
                if(time2-time1==15 or time2-time1<=0):
                    return False
                continue
    
def getMeasure(dat):
    time1 = int(datetime.now().strftime("%S"))
    while True:
        global n1,n2,n3
        cli_sock.settimeout(5)
        cli_sock.sendto(dat.encode(),meter_addr)
        #recv timeout check(for 5minutes if fail getSerial())
        try:
            measure_data,addr = cli_sock.recvfrom(1024)
        except socket.timeout:
            print("UDP recv failed. try again(measure)")
            time2 = int(datetime.now().strftime("%S"))
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        #measure_data 유효성 검사 
        measure = split_str(measure_data)
        if(measure==False):
            print('UDP received data wrong. try again')
            time2 = int(datetime.now().strftime("%S"))
            if(time2-time1==15 or time2-time1<=0):
                return False
            continue
        else:
            mea_dat[0] = measure[n1]
            mea_dat[1] = measure[n2]
            mea_dat[2] = measure[n3]
            return mea_dat

def checkSerial(o_serial):
    n_serial = getSerial('I')
    if(o_serial==n_serial):
        return False
    else:
        return n_serial


#read conf. file
setup_conf()
#datetime
now = datetime.now
#value
meter_addr = (meter_ip,meter_port) 
collect = ['','','']
mea_dat = ['','','']
n1 = 0
n2 = 0
n3 = 0
CollectData = ''
#SpringBoot URL, Variable
url = 'http://localhost:8989/meter/'
msg = "\"message\":null"

cli_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
cli_sock.bind(('',56686))
log('p','')
def main():
    
    while True:
        #getSerial
        serial = getSerial('I')
        if(type(serial) == str):
            log('ss',serial)
            print('    DATE     HOUR\t  SERIAL\tiPM\tSampHum SampTemp')
            requests.post('http://localhost:8989/meter/'+serial)
        elif(serial == False):
            log('sf','serial')
            main()
            
        time1 = float(datetime.now().strftime("%M.%S"))
        #Check Serial Every 5 minutes
        while True:
            #collect data
            log('st','Data')
            CollectData = getData('g')
            if(type(CollectData)==list):
                MeasureData = getMeasure('G')
                if(type(MeasureData)==list):
                    log('s','Measure')
                    data = {'pm25':MeasureData[0],'humidity':MeasureData[1],'temperature':MeasureData[2]}
                    r = requests.put('http://localhost:8989/meter/'+serial, data).text
                    if(msg in r):
                        main()
                    dataFile(datetime.now().strftime("%Y-%m-%d %H:%M:%S"),serial,CollectData, MeasureData)
                elif(MeasureData == False):
                    log('f','Measure')
                    log('r','Measure')
                    main()
            elif(CollectData == False):
                log('f','Data')
                log('r','Data')
                main()
            
            time.sleep(5)
            time2 = float(datetime.now().strftime("%M.%S"))
            if(time2-time1==5.0 or time2-time1<0.0):
                if(checkSerial(serial) == False):
                    pass
                else:
                    main()





main()

import FdrsMeter
import sys, os, time, datetime, socket, threading

class Receiver():
    def __init__(self):
        self.MyReceiver = Meter()
        self.MyReceiver.start()
        
#declare socket & binding
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
meter_ip = '192.168.1.114'
meter_port = 2002
address = (meter_ip, meter_port)
print("Listening on "+meter_ip+" : "+str(meter_port))
sock.bind(address)

#info (serial, column, data)
serial = ['DLISP','Base V3.12.4','MC16,PM-711','3191 V1.0.5',
                   'Dry V3.2.3','Base V3.12.4']

column = ['gyyyy','mm','dd','hh','nn','ss','dt','MS','iPM','cPM','SampPress(kPa)','SampTemp()','SampHum()',
          'AirPress(kPa)','AirTemp()','AirHUM()','lFlow(Lpm)','Flow(Lpm)','CtrlFlow(Lpm)','FlowCtrl(mV)',
          'FlowCtrl','HVolt(V)','InnerTemp()','DetSig(kcps)','revTemp()','totalFlow(m3)','totalFlow(m3)','DetSig(kcps)',
          'AirPress(kPa)','SampPress(kPa)','SampTemp()','Det-W(ug)','aveMFlow','aveAFlow','cntPM','intPM','avePM','PM-rawW',
          'PM-baseW','PM-integW','PM-diffW','PM-integC','diffPress','InitPress','AP0','P0','T0','revT0','integWdet','integWobc','contDet',
          'MeasStatus']
data = ['10','20','3','4','nn','ss','dt','MS','85','cPM','SampPress(kPa)','66','29',
          'AirPress(kPa)','AirTemp()','AirHUM()','lFlow(Lpm)','Flow(Lpm)','CtrlFlow(Lpm)','FlowCtrl(mV)',
          'FlowCtrl','HVolt(V)','InnerTemp()','DetSig(kcps)','revTemp()','totalFlow(m3)','totalFlow(m3)','DetSig(kcps)',
          'AirPress(kPa)','SampPress(kPa)','SampTemp()','Det-W(ug)','aveMFlow','aveAFlow','cntPM','intPM','avePM','PM-rawW',
          'PM-baseW','PM-integW','PM-diffW','PM-integC','diffPress','InitPress','AP0','P0','T0','revT0','integWdet','integWobc','contDet',
          'MeasStatus']

ser = ','.join(serial)
col = ','.join(column)
dat = ','.join(data)
while True:
     data, cli_addr = sock.recvfrom(1024)
     if(data.decode() == "I"):
         sock.sendto(ser.encode(), cli_addr)
         
     elif(data.decode() == "g"):
         sock.sendto(col.encode(), cli_addr)
         start = ''
     elif(data.decode() is 'G'):
        sock.sendto(dat.encode(), cli_addr)
        start = ''
sock.close()

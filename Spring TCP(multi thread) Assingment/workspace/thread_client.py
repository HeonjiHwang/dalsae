import socket
import random, time
import threading
import uuid
import struct, binascii

def serial():
    serial = uuid.uuid4()
    serial = str(serial).split('-')
    serial = serial[0]
    return serial

def wait():
    wait = random.randint(5,10)
    return wait

def epoch():
    epoch = int(time.time()*1000)
    return epoch

def data():
    data = round(random.uniform(1,100),2)
    return data

def arr(info):
    arr = []
    if(len(arr)<3):
        arr.append(info)
    else:
        del arr[2]
        arr.append(info)
    return arr


def works():
    HOST = 'localhost'
    PORT = 7777
    num = []

    while True:
        sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        try:
            sock.connect((HOST,PORT))
        except:
            print('Could not connect to server')
            time.sleep(5)
            continue
        while True:
            ser = serial()
            value1 = struct.pack('8s',ser.encode())
            try:
                sock.send(value1)
            except:
                print('Could not send serial')
                time.sleep(5)
                works()
            print(ser)
            for i in range(0,30):
                dat = data()
                ep = epoch()
                value2 = struct.pack('8s q f',ser.encode(), ep ,dat)
                try:
                    sock.send(value2)
                except:
                    print('send data error')
                    time.sleep(5)
                    works()
                print(dat)
                time.sleep(1)
            sock.close()
            break


        wait()
        print('대기시간 :: ',wait())
        time.sleep(wait())


for i in range(0,1):
    thread = threading.Thread(target=works)
    print("\n")
    thread.daemon=True
    thread.start()

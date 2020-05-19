import socket
import random, time
import threading
import uuid

def serial():
    wait = random.randint(5,10)
    serial = uuid.uuid4()
    serial = str(serial).split('-')
    serial = serial[0]
    return serial

def wait():
    wait = random.randint(5,10)
    return wait

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
        sock.connect((HOST,PORT))
        while True:
            ser = serial()
            wai = wait()
            for i in range(0,5):
                dat = data()
                sock.send(ser.encode())
                time.sleep(1);
                sock.send(str(wai).encode())
                time.sleep(1);
                sock.send(str(data()).encode())
                time.sleep(1)
            sock.close()
            break


        print('대기시간 :: ',wait())
        #time.sleep(wait())



for i in range(0,1):
    thread = threading.Thread(target=works)
    print("\n")
    thread.daemon=True
    thread.start()

import socket
import random, time
import threading

def works():
    HOST = 'localhost'
    PORT = 7777
    num = []
    serial = random.randint(10000000,99999999)
    while True:
        sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        sock.connect((HOST,PORT))
        while True:
            sock.send(str(serial).encode())
            print(serial)
            for i in range(0,15):
                data = random.randint(1,100)
                sock.send(str(data).encode())
                num.append(data)
                print(data)
                time.sleep(1)
                #if(i==9):
                #     print(num)
            num.clear()
            sock.close()
            break
        wait = random.randint(5,10)
        print('대기시간 :: ',wait)
        time.sleep(wait)



for i in range(0,2):
    thread = threading.Thread(target=works)
    thread.daemon=True
    thread.start()
    time.sleep(2)

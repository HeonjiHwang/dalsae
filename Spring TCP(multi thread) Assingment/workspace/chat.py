import socket
import random, time
import threading

def works():
    HOST = 'localhost'
    PORT = 7777
    num = []
    while True:
        sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        sock.connect((HOST,PORT))
        while True:
            serial = random.randint(10000000,99999999)
            sock.send(str(serial).encode())
            print(serial)
            for i in range(0,5):
                data = random.randint(1,100)
                sock.send(str(data).encode())
                num.append(data)
                time.sleep(1)
            print(num)
            break
        num.clear()
        sock.close()
        wait = random.randint(5,10)
        print(wait)
        time.sleep(wait)



for i in range(1,3):
    thread = threading.Thread(target=works)
    thread.daemon=True
    thread.start()
    time.sleep(2)

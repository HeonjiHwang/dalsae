import socket
import random, time

HOST = 'localhost'
PORT = 7777
num = []
sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
sock.connect((HOST,PORT))
for i in range(0,10):
    X = random.randint(1,100)
    num.append(X)
    sock.send(str(num[i]).encode())
    print('send')
    time.sleep(1)

print(num)
sock.close()





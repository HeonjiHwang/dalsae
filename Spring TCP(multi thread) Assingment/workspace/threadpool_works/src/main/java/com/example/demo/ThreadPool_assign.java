package com.example.demo;

import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class ThreadPool_assign {
	private static byte[] bytes = new byte[100];
	private static ArrayList<Object> list = new ArrayList<Object>();
	private static HashMap<Double, String> map = new HashMap<Double,String>();
	
	public static void main(String[] args) {
		ServerSocket server;
		Socket socket;
		ThreadPoolExecutor ex = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
		
		try {
			long start = System.currentTimeMillis();
			server = new ServerSocket();
			server.bind(new InetSocketAddress("localhost",7777));
			
			while(true) {
				socket = server.accept();
				try {
					InputStream in = socket.getInputStream();
					int read = in.read(bytes);
					if(read == -1) {
						socket.close();
					}else {
						String serial = new String(bytes,0,read);
						list.add(serial);
						Log log = new Log("연결수락", serial, socket.getInetAddress().toString(), socket.getPort());
						System.out.println(log.toString());
						System.out.println(map);
						ex.execute(new ConnectionWrap(socket, serial, start, map));
					}
				}catch(Exception e) {
					
				}
			}
		}catch(Exception e) {}
	}
}




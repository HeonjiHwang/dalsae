package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.util.HashMap;

public class ConnectionWrap implements Runnable{
	private Socket socket;
	private String serial;
	private long start;
	private static HashMap<Double, String> map = new HashMap<Double,String>();
	private byte[] bytes = new byte[100];
	
	public ConnectionWrap(Socket socket, String serial, long start, HashMap<Double, String> map) {
		this.socket = socket;
		this.serial = serial;
		this.start = start;
		this.map = map;
	}

	@Override
	public void run() {
		try {
			String threadname = Thread.currentThread().getName();
			System.out.println(threadname);
			
			while(true) {
				InputStream in = socket.getInputStream();
				int read = in.read(bytes);
				if(read==-1) {
					continue;
				}
				String num = new String(bytes,0,read);
				double data = Double.parseDouble(num);
				
				/*
				 *  put data in list ->
				 * */
				SharedData.getInstance().putData(data);
				map.put(data, serial);
				

				long end = System.currentTimeMillis();
				System.out.println((end-start)/1000 %20 +1);
				if((end-start)/1000 % 20 == 0) {
					AnalysisWorks ay = new AnalysisWorks(map);
					ay.start();
				}
			}
		}catch(Exception e) {
			try {
				socket.close();
				Log log = new Log("연결해제", serial, socket.getInetAddress().toString(), socket.getPort());
				System.out.println(log.toString());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}
}

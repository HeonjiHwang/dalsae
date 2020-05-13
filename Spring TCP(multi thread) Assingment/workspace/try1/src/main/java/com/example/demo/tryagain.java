package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class tryagain {
	
	private static byte[] bytes = new byte[100];
	private static ArrayList<Object> list = new ArrayList<Object>();
	
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
						Logger log = new Logger("연결수락", serial, socket.getInetAddress().toString(), socket.getPort());
						System.out.println(log.toString());
						ex.execute(new Works(socket, serial, start));
					}
				}catch(Exception e) {
					
				}
			}
		}catch(Exception e) {}
	}
}

class Works implements Runnable {
	private Socket socket;
	private String serial;
	private long start;
	private static HashMap<Double, String> map = new HashMap<Double,String>();
	private byte[] bytes = new byte[100];
	
	public Works(Socket socket, String serial, long start) {
		this.socket = socket;
		this.serial = serial;
		this.start = start;
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
				SharedData2.getInstance().putData(data, serial);
				

				long end = System.currentTimeMillis();
				System.out.println((end-start)/1000 %20 +1);
				if((end-start)/1000 % 20 == 0) {
					AnalysisData ay = new AnalysisData();
					ay.start();
				}
			}
		}catch(Exception e) {
			try {
				socket.close();
				Logger log = new Logger("연결해제", serial, socket.getInetAddress().toString(), socket.getPort());
				System.out.println(log.toString());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

}

//분석 스레드
class AnalysisData extends Thread{
	private ArrayList<Object> listPop = new ArrayList<Object>();
	private HashMap map;
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		System.out.println("----------------------------");
		SharedData.getInstance().getData(listPop);
		double sum = 0;
		double avg = 0;
		int count = 0;
		Double max = null;
		String serial = null;
		
		for(Object data : listPop) {
			sum+= (Double)data;
			count++;
			if (max == null || max.doubleValue() < (double)data) {
				max = (double)data;
			}
		}

		serial = SharedData2.getInstance().getData(max);
		avg = sum/count;
		System.out.println("sum : "+String.format("%.2f", sum));
		System.out.println("max : "+max);
		System.out.println("avg : "+String.format("%.2f", avg));
		System.out.println("max serial : "+serial);
	}
	
}

class Logger {
	
	private String status;
	private String serial;
	private String socket_addr;
	private int socket_port;
	private SimpleDateFormat format1 = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
	Calendar cal = Calendar.getInstance();
	String time = format1.format(cal.getTime());
	
	//생성자
	public Logger(String status, String serial, String socket_addr, int socket_port) {
		this.status = status;
		this.serial = serial;
		this.socket_addr = socket_addr;
		this.socket_port = socket_port;
	}
	
	
	@Override
	public String toString() {
		return "Log [status=" + status + ", serial=" + serial + ", socket_addr=" + socket_addr + ", socket_port="
				+ socket_port + ", socket_port=" + time + "]";
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getSerial() {
		return serial;
	}


	public void setSerial(String serial) {
		this.serial = serial;
	}


	public String getSocket_addr() {
		return socket_addr;
	}


	public void setSocket_addr(String socket_addr) {
		this.socket_addr = socket_addr;
	}


	public int getSocket_port() {
		return socket_port;
	}


	public void setSocket_port(int socket_port) {
		this.socket_port = socket_port;
	}
}
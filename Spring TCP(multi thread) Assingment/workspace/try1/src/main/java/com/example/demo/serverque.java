package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class serverque {
	private static final int THREAD_CNT = 10;
	private static byte[] bytes = new byte[100];
	private static ArrayList<Object> list = new ArrayList<Object>();
	private static String serial;
	
	public static void main(String[] args) throws InterruptedException {
		ServerSocket ser_sock;
		Socket sock;
		ThreadPoolExecutor exService = (ThreadPoolExecutor) Executors.newFixedThreadPool(THREAD_CNT);
		
		try {
			ser_sock = new ServerSocket();
			ser_sock.bind(new InetSocketAddress("localhost",7777));
			long start = System.currentTimeMillis();
			//포트 바인딩
			while(true) {
				sock = ser_sock.accept();
				try {
					//serial읽어오기
					InputStream in = sock.getInputStream();
					int read = in.read(bytes);
					if(read==-1) {
						System.out.println("there is no data to read");
						sock.close();
					}else {
						//연결수락 log
						serial = new String(bytes,0,read);
						Log log = new Log("연결수락", serial, sock.getInetAddress().toString(), sock.getPort());
						System.out.println(log.toString());
						exService.execute(new ConnectionWrap(sock, serial, start));
					}
				}catch(Exception e) {}
			}
		}catch(Exception e) {}
	}
	
}
//소켓 처리용 래퍼 클래스
class ConnectionWrap implements Runnable{
	
	private Socket sock = null;
	private Queue<Integer> queue = new LinkedList<>();
	private String num = null;
	private byte[] bytes = new byte[100];
	private long start;
	private String serial;
	private static ArrayList<Object> list = new ArrayList<Object>();
	//생성자
	public ConnectionWrap(Socket sock, String serial, long start) {
			this.sock = sock;
			this.serial = serial;
			this.start = start;
			queue.offer(Integer.parseInt(serial));
	}
	@Override
	public void run() {
		try {
			//스레드 이름
			String threadname = Thread.currentThread().getName();
			System.out.println("--"+threadname);
			
			//Read data
			while(true) {
				InputStream in = sock.getInputStream();
				int read = in.read(bytes);
				
				//일단 이렇게(대기시간동안 오류처리 ㄱㄱ)
				if(read==-1) {
					Thread.sleep(3000);
					continue;
				}
				
				num = new String(bytes,0,read);
				int data = Integer.parseInt(num);
				queue.offer(data);
				int a = queue.poll();
				list.add(a);
			}
		}catch(IOException e) {
			System.out.println("--connection reset--");
			try {
				sock.close();
				Log log = new Log("연결해제", serial, sock.getInetAddress().toString(), sock.getPort());
				System.out.println(log.toString());
			} catch (IOException e1) {}
		} catch (InterruptedException e) {}
	}
}


//분석 thread
class Analysis extends Thread{
	//생성자
	public Analysis(ArrayList<Object> list) {
	}
	public void run() {
	}
}

class Log {
	
	private String status;
	private String serial;
	private String socket_addr;
	private int socket_port;
	private SimpleDateFormat format1 = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
	Calendar cal = Calendar.getInstance();
	String time = format1.format(cal.getTime());
	
	//생성자
	public Log(String status, String serial, String socket_addr, int socket_port) {
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



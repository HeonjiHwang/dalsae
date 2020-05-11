package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class serverque {
	private static final int THREAD_CNT = 10;
	public static void main(String[] args) {
		ServerSocket ser_sock = null;
		Socket sock = null;
		ThreadPoolExecutor exService = (ThreadPoolExecutor) Executors.newFixedThreadPool(THREAD_CNT);
		try {
			ser_sock = new ServerSocket();
			
			ser_sock.bind(new InetSocketAddress("localhost",7777));
			//포트 바인딩
			while(true) {
				System.out.println("[연결 기다리는 중...]");
				sock = ser_sock.accept();
				System.out.println("[연결 수락...]");
				try {
					//소켓 연결이 되면 스레드로 소켓을 넣어줌
					//스레드 내에서 작업 처리
					exService.execute(new ConnectionWrap(sock));
				}catch(Exception e) {
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}

//소켓 처리용 래퍼 클래스
class ConnectionWrap implements Runnable{
	
	private Socket sock = null;
	private Queue<Integer> queue = new LinkedList<>();
	private String num = null;
	private byte[] bytes = new byte[100];
	private long start;
	private ArrayList list = new ArrayList();
	private int i;
	
	//생성자
	public ConnectionWrap(Socket sock) {
			this.sock = sock;
	}
	
	@Override
	public void run() {
		int i = 0;
		try {
			String threadname = Thread.currentThread().getName();
			System.out.println("--"+threadname);
			while(true) {
				InputStream in = sock.getInputStream();
				int read = in.read(bytes);
				//일단 이렇게
				if(read==-1) {
					//System.out.println("아무것도 못받아옴 계속 시도 ㄱㄱ");
					continue;
				}
				num = new String(bytes,0,read);
				int data = Integer.parseInt(num);
				queue.offer(data);
				list.add(queue.poll());
				i++;
				System.out.println(i);
				if(i==16) {
					Thread.sleep(1);
					Analysis ay = new Analysis(list);
					ay.start();
				}
			}
		}catch(IOException e) {
			System.out.println("--connection reset--");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

//분석 thread
class Analysis extends Thread{
	private Queue<Integer> queue = new LinkedList<>();
	private ArrayList list = new ArrayList();
	int sum = 0;
	//생성자
	public Analysis(ArrayList list) {
		this.list = list;
	}
	public synchronized void run() {
		System.out.println(list);
		for(int i =1;i<list.size();i++) {
			sum += (int) list.get(i);
		}
		System.out.println(sum);
		
	}
}
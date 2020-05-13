package com.example.demo;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;

public class WorkingQueue extends Thread{
	private Queue<Integer> queue = new LinkedList<>();
	private int data;
	//생성자
	public WorkingQueue(int data) {
		this.data = data;
		// TODO Auto-generated constructor stub
	}
	
	public void run() {
		//스레드 
		synchronized(this) {
			ArrayList list = new ArrayList();
			list.add(data);
			System.out.println(list);
		}
		notify();
	}
}

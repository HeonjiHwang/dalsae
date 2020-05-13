package com.example.demo;

import java.util.ArrayList;

public class syn_ex {
	public static void main(String[] args) {
		testThread a;
		test2Thread b;
		a = new testThread();
		a.start();
		b = new test2Thread();
		b.start();
	}
}
class Test extends Thread{
	@Override
	public void run() {
		ArrayList<Object> list = new ArrayList<Object>();
		ArrayList<Object> serial = new ArrayList<Object>();
		SharedData.getInstance().getData(list);
		
		int sum = 0;
		Integer max = null;
		Integer ser = null;
		int count = 0;
		for(Object data : list) {
			if((int)data<101) {
				sum += (int)data;
				count++;
				if(max==null || max.intValue()< (int)data) {
					max = (int)data;
				}
			}
			else
				serial.add(data);
				
		}
		System.out.println("sum" + sum);
		System.out.println("max" + max);
		System.out.println("serial : "+serial);
	}
	
}

class testThread extends Thread{
	Test test;

	@Override
	public void run() {
		int serial = 98765432;
		SharedData.getInstance().putData(serial);
		for(int i=0;i<=10;i++) {
			SharedData.getInstance().putData(i);
		}
	}
}

class test2Thread extends Thread{
	Test test;

	@Override
	public void run() {
		int serial = 12345678;
		SharedData.getInstance().putData(serial);
		for(int i=0;i<=10;i++) {
		SharedData.getInstance().putData(i);
		}
		Test test = new Test();
		test.start();		
	}
}
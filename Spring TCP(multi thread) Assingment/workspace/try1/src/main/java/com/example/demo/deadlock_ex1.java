package com.example.demo;

public class deadlock_ex1 {
	public static Object l1 = new Object();
	public static Object l2 = new Object();
	
	public static void main(String[] args) {
		Thread1 t1 = new Thread1();
		Thread2 t2 = new Thread2();
		
		t1.start();
		t2.start();
	}
	
	private static class Thread1 extends Thread{
		public void run() {
			synchronized(l1) {
				System.out.println("thread1 : holding lock1...");
				try {
					Thread.sleep(10);
				}catch(InterruptedException e) {
					e.printStackTrace();
				}
				System.out.println("thread1 : waiting for lock2...");
				synchronized(l2) {
					System.out.println("thread1 : holding lock 1&2...");
				}
			}
		}
	}
	
	private static class Thread2 extends Thread{
		public void run() {
			synchronized(l1) {
				System.out.println("thread2 : holding lock2...");
				try {
					Thread.sleep(10);
				}catch(InterruptedException e) {
					e.printStackTrace();
				}
				System.out.println("thread2 : waiting for lock1...");
				synchronized(l2) {
					System.out.println("thread2 : holding lock 1&2...");
				}
			}
		}
	}
}

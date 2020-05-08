package com.example.demo;

//thread 클래스 사용해서 구현
public class multithread_ex {
	public static void main(String[] args) {
		Thread1 t1 = new Thread1();
		Thread2 t2 = new Thread2();
		
		t1.start();
		t2.start();
		//실행 결과 priority가 같아서 서로 경쟁하며 실행이된다
	}
}

class Thread1 extends Thread{
	//run()method overriding
	public void run() {
		//work
		setName("thread1");
		for(int i=0;i<15;i++) {
			System.out.println(getName());
		}
	}
}

class Thread2 extends Thread{
	public void run() {
		setName("thread2");
		for(int i=0;i<15;i++) {
			System.out.println(getName());
		}
	}
}

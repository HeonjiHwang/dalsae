package com.example.demo;


//thread 클래스의 경우 다른 클래스 상속 불가능
//runnable 인터페이스를 구현하는 방법으로 스레드 상속 ㄱㄱ
//runnable 인터페이스는 run()메서드 하나만 가지고 있음 -> thread클래스의 메서드 사용 불가 
public class thread_ex extends Thread{
	public static void main(String[] args) {
		ThreadWithClass tc = new ThreadWithClass(); //thread클래스 상속
		Thread thread2 = new Thread(new ThreadWithRunnable());  //runnable 인터페이스 구현
		
		tc.start();
		thread2.start();
	}
}


class ThreadWithClass extends Thread{
	public void run() {
		for(int i=0;i<5;i++) {
			System.out.println(getName()); //현재 실행중인 스레드의 이름을 반환
			try {
				Thread.sleep(10); //0.01초간 스레드 멈춤
			}catch(InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}

class ThreadWithRunnable implements Runnable{

	@Override
	public void run() {
		// TODO Auto-generated method stub
		for(int i=0;i<5;i++) {
			System.out.println(Thread.currentThread().getName());//현재 실행중인 스레드 이름 반환
			try {
				Thread.sleep(10);
			}catch(InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
}
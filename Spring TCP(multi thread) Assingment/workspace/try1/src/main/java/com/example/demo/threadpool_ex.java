package com.example.demo;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class threadpool_ex {

	public static void main(String[] args) {
		
		//최대 스레드 갯수 = 2
		ExecutorService exService = Executors.newFixedThreadPool(2);
		
		for(int i=0;i<10;i++) {
			Runnable run = new Runnable() {

				@Override
				public void run() {
					//스레드에 시킬 작업내용 
					
					ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)exService;
					
					int poolSize = threadPoolExecutor.getPoolSize(); //스레드 풀 사이즈 얻기
					String threadName = Thread.currentThread().getName(); //최근 실행된 스레드 이름 가져오기
					
					System.out.println("[ 총 스레드 개수 : "+poolSize+" ] 작업 스레드 이름 : "+threadName);
					
					//일부러 예외 발생
					//int value = Integer.parseInt("예외");
					
				}
			};
			
			//스레드풀에 작업요청
			//execute = 예외 발생할 경우 스레드 종료 후 새로운 스레드 생성
			//submit = 예외 발생해도 해당 스레드는 죽이지 않고 실행   
			//exService.execute(run);
			exService.submit(run);
			
			//콘솔 출력 시간
			try {
				Thread.sleep(10);
			}catch(InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		//스레드풀 종료
		exService.shutdown();
	}

}

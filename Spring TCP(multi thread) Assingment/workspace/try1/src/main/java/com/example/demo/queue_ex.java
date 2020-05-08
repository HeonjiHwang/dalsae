package com.example.demo;

import java.util.LinkedList;
import java.util.Queue;

public class queue_ex {

	public static void main(String[] args) {
		//큐생성
		Queue<Integer> queue = new LinkedList<>();
		int[] arr = new int[8];
		int sum = 0;
		//데이터 집어넣기
		queue.offer(3);
		queue.offer(4);
		queue.offer(5);
		queue.offer(3);
		queue.offer(6);
		queue.offer(8);
		queue.offer(7);
		queue.offer(3);
		int a = queue.size();
		
		for(int i =0;i<8;i++) {
			arr[i] = queue.poll();
			System.out.println(arr[i]);
			sum += arr[i];
		}
		double avg = (double)sum/a;
		//큐 출력
		System.out.println(sum);
		System.out.println(avg);
		
	}
}

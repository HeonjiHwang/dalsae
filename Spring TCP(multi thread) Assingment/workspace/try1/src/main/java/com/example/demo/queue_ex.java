package com.example.demo;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;

public class queue_ex {

	public static void main(String[] args) {
		//큐생성
		Queue<Integer> queue = new LinkedList<>();
		ArrayList list = new ArrayList();
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
		
		
		System.out.println(a);
		for(int i=0;i<a;i++) {
			list.add(i, queue.poll());
		}
		//큐 출력
		System.out.println(list);
		
		int c = 15;
		int b = 30;
		
		System.out.println(b%c);
		
	}
}

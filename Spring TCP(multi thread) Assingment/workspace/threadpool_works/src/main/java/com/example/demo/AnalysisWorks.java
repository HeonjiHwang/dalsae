package com.example.demo;

import java.util.ArrayList;
import java.util.HashMap;

//분석 스레드
class AnalysisWorks extends Thread{
	private ArrayList<Object> listPop = new ArrayList<Object>();
	private HashMap<Double, String> map;
	
	public AnalysisWorks(HashMap<Double, String> map) {
		this.map = map;
	}
	@Override
	public void run() {
		SharedData.getInstance().getData(listPop);
		
		double sum = 0;
		double avg = 0;
		int count = 0;
		Double max = null;
		Double min = null;
		String maxSerial = null;
		
		for(Object data : listPop) {
			sum+= (Double)data;
			count++;
			if (max == null || max.doubleValue() < (double)data) {
				max = (double)data;
				maxSerial = (String) map.get(max);
			}
			if (min == null || min.doubleValue() > (double)data) {
				min = (double)data;
			}
		}
		
		avg = (count>0)?sum/count:0;
		System.out.println("min : "+String.format("%.2f", min));
		System.out.println("max : "+max);
		System.out.println("avg : "+String.format("%.2f", avg));
		System.out.println("max serial : "+maxSerial);
		map.clear();
	}
	
}
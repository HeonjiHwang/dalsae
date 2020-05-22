package com.example.demo.analysis;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.Repository.collectedRepo;
import com.example.demo.model.collectedModel;
import com.example.demo.shared.CollectData;
import com.example.demo.shared.SharedData;

//분석 스레드
public class AnalysisWorks implements Runnable{
	private ArrayList<CollectData> listPop = new ArrayList<CollectData>();
	@Autowired
	private collectedRepo colRepo;
	
	public AnalysisWorks(collectedRepo colRepo) {
		this.colRepo = colRepo;
	}
	
	@Override
	public void run() {
		while(true) {
			
			
			try {
				Thread.sleep(60000);
			}catch(Exception e){
				e.printStackTrace();
			}

			SharedData.getInstance().getData(listPop);
			
			if(listPop.size()<=0) {
				System.out.println("there is no data to put on database");
				continue;
			}
			
			double sum = 0;
			Double avg = null;
			int count = 0;
			Float max = null;
			Float min = null;
			String maxSerial = null;
			
			
			for(CollectData data : listPop) {
				sum+= data.getValue();
				++count;
				if (max == null || max.doubleValue() < data.getValue()) {
					max = data.getValue();
					maxSerial = data.getSerial();
				}
				if (min == null || min.doubleValue() > data.getValue()) {
					min = data.getValue();
				}
			}
			listPop.clear();
			avg = (double) ((count>0)?sum/count:0);
			System.out.println("min : "+min);
			System.out.println("max : "+max);
			System.out.println("avg : "+String.format("%.2f", avg));
			System.out.println("max serial : "+maxSerial);
			collectedModel colMod = new collectedModel(maxSerial, avg, max, min);
			System.out.println(colMod.toString());
			colRepo.save(colMod);
		}
	}
}


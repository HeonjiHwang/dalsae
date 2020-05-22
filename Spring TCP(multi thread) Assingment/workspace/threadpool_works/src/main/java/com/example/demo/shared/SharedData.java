package com.example.demo.shared;

import java.util.ArrayList;

public class SharedData {
	// Data queue
	private ArrayList<CollectData> listData = new ArrayList<CollectData>();
	String ser;
	// Singleton
	private static SharedData _instance = null;
	private SharedData() {}
	public static synchronized SharedData getInstance() {
		if (_instance == null) {
			_instance = new SharedData();
		}
		return _instance;
	}
	public void putData(CollectData data) {
		synchronized(this.listData) {
			listData.add(data);
		}
	}
	public void getData(ArrayList<CollectData> listPop) {
		synchronized(this.listData) {
			while(listData.size() > 0) {
				listPop.add( listData.remove(0) );
			}
		}
	}
	
}

package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class SharedData {
	// Data queue
	public ArrayList<Object> listData = new ArrayList<Object>();
	// Singleton
	private static SharedData _instance = null;
	private SharedData() {}
	public static synchronized SharedData getInstance() {
		if (_instance == null) {
			_instance = new SharedData();
		}
		return _instance;
	}
	public void putData(Object data) {
		synchronized(this.listData) {
			listData.add(data);
		}
	}
	public void getData(List<Object> listPop) {
		synchronized(this.listData) {
			while(listData.size() > 0) {
				listPop.add( listData.remove(0) );
			}
		}
	}
}

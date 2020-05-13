package com.example.demo;

import java.util.HashMap;

public class SharedData2 {
	// Data queue
	public HashMap<Double, String> listData = new HashMap<Double, String>();
	// Singleton
	private static SharedData2 _instance = null;
	private SharedData2() {}
	public static synchronized SharedData2 getInstance() {
		if (_instance == null) {
			_instance = new SharedData2();
		}
		return _instance;
	}
	public void putData(Double key, String value) {
		synchronized(this.listData) {
			listData.put(key, value);
		}
	}
	public String getData(Double key) {
		String maxS = null;
		synchronized(this.listData) {
			maxS = listData.get(key);
			listData.clear();
		}
		return maxS;
	}
}

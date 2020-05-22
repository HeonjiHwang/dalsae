package com.example.demo.shared;

public class CollectData {
	
	private String serial;
	private long epoch;
	private float value;
	
	public CollectData(String serial, long epoch, float value) {
		this.serial = serial;
		this.epoch = epoch;
		this.value = value;
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}
	public long getEpoch() {
		return epoch;
	}
	public void setEpoch(long epoch) {
		this.epoch = epoch;
	}
	public float getValue() {
		return value;
	}
	public void setValue(float value) {
		this.value = value;
	}
}

package com.example.demo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "colleted")
public class DataInfo {
	
	@Id
	private double avg;
	@Column
	private double min;
	@Column
	private double max;
	@Column
	private String maxSerial;

	public DataInfo(double avg, double min, double max, String maxSerial) {
		this.avg = avg;
		this.min = min;
		this.max = max;
		this.maxSerial = maxSerial;
	}

	public double getAvg() {
		return avg;
	}

	public void setAvg(double avg) {
		this.avg = avg;
	}

	public double getMin() {
		return min;
	}

	public void setMin(double min) {
		this.min = min;
	}

	public double getMax() {
		return max;
	}

	public void setMax(double max) {
		this.max = max;
	}

	public String getMaxSerial() {
		return maxSerial;
	}

	public void setMaxSerial(String maxSerial) {
		this.maxSerial = maxSerial;
	}
	
}

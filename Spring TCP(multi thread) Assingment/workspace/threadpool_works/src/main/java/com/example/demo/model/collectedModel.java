package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="collected")
public class collectedModel {

	
	@Column(name="min")
	private Float min;

	@Column(name="max")
	private Float max;

	@Column(name="avg")
	private Double avg;
	@Id
	@Column(name="max_serial")
	private String maxSerial;
	
	

	public collectedModel() {}

	public collectedModel(String serial, Double avg, Float max, Float min) {
		super();
		this.min = min;
		this.max = max;
		this.avg = Double.parseDouble(String.format("%.2f",avg));
		this.maxSerial = serial;
		
	}

	
	public Float getMin() {
		return min;
	}

	public void setMin(Float min) {
		this.min = min;
	}

	public Float getMax() {
		return max;
	}

	public void setMax(Float max) {
		this.max = max;
	}

	public Double getAvg() {
		return avg;
	}

	public void setAvg(Double avg) {
		this.avg = avg;
	}

	public String getSerial() {
		return maxSerial;
	}

	public void setSerial(String serial) {
		this.maxSerial = serial;
	}

	
	@Override
	public String toString() {
		return "dataGetSet [min=" + min + ", max=" + max + ", avg=" + avg + ", maxSerial=" + maxSerial + "]";
	}
	
}
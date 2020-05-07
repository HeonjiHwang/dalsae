package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "meter_info")
public class MeterInfo {
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	

	@Id
	private Integer meter_id;
	
	@Column(name = "meter_serial", nullable = false)
	private String meter_serial;

	public MeterInfo() {}
	
	public MeterInfo(Integer meter_id, String meter_serial) {
		super();
		this.meter_id = meter_id;
		this.meter_serial = meter_serial;
	}
	
	//getter & setter
	public Integer getMeter_id() {
		return meter_id;
	}

	public void setMeter_id(Integer meter_id) {
		this.meter_id = meter_id;
	}

	public String getMeter_serial() {
		return meter_serial;
	}

	public void setMeter_serial(String meter_serial) {
		this.meter_serial = meter_serial;
	}

	@Override
	public String toString() {
		return "MeterInfo [meter_id=" + meter_id + ", meter_serial=" + meter_serial + "]";
	}
	
	
	
}

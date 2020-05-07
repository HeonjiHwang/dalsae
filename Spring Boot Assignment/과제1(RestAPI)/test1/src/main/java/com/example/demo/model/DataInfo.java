package com.example.demo.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.example.demo.date.CommonDateEntity;

@Entity
@Table(name = "meter_data")
public class DataInfo extends CommonDateEntity{
	
	
	
	@Column(name = "meter_id", nullable = false)
	private Integer meter_id;

	@Column(name = "pm25", nullable = false)
	private double pm25;
	
	@Column(name = "humidity", nullable = false)
	private double humidity;
	
	@Column(name = "temperature", nullable = false)
	private double temperature;
	
	//@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	@Id
	@Column(name = "collect_time", nullable = false)
	private LocalDateTime collect_time;
	
	
	public DataInfo() {}
	
	public DataInfo(Integer meter_id, double pm25, double humidity, double temperature, LocalDateTime collect_time) {
		super();
		
		this.meter_id = meter_id;
		this.pm25 = pm25;
		this.humidity = humidity;
		this.temperature = temperature;
		this.collect_time = collect_time;
	}


	public Integer getMeter_id() {
		return meter_id;
	}

	public void setMeter_id(Integer meter_id) {
		this.meter_id = meter_id;
	}

	public double getPm25() {
		return pm25;
	}

	public void setPm25(double pm25) {
		this.pm25 = pm25;
	}

	public double getHumidity() {
		return humidity;
	}

	public void setHumidity(double humidity) {
		this.humidity = humidity;
	}

	public double getTemperature() {
		return temperature;
	}

	public void setTemperature(double temperature) {
		this.temperature = temperature;
	}

	public LocalDateTime getCollect_time() {
		return collect_time;
	}

	public void setCollect_time(LocalDateTime date) {
		this.collect_time = date;
	}

	@Override
	public String toString() {
		return "DataInfo [meter_id=" + meter_id + ", pm25=" + pm25 + ", humidity=" + humidity + ", temperature="
				+ temperature + ", collect_time=" + collect_time + "]";
	}
	
	
}

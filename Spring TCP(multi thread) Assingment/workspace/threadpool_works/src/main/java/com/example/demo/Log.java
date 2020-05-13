package com.example.demo;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Log {

	private String status;
	private String serial;
	private String socket_addr;
	private int socket_port;
	private SimpleDateFormat format1 = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
	Calendar cal = Calendar.getInstance();
	String time = format1.format(cal.getTime());
	
	//생성자
	public Log(String status, String serial, String socket_addr, int socket_port) {
		this.status = status;
		this.serial = serial;
		this.socket_addr = socket_addr;
		this.socket_port = socket_port;
	}
	
	
	@Override
	public String toString() {
		return "Log [status=" + status + ", serial=" + serial + ", socket_addr=" + socket_addr + ", socket_port="
				+ socket_port + ", socket_port=" + time + "]";
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getSerial() {
		return serial;
	}


	public void setSerial(String serial) {
		this.serial = serial;
	}


	public String getSocket_addr() {
		return socket_addr;
	}


	public void setSocket_addr(String socket_addr) {
		this.socket_addr = socket_addr;
	}


	public int getSocket_port() {
		return socket_port;
	}


	public void setSocket_port(int socket_port) {
		this.socket_port = socket_port;
	}
}

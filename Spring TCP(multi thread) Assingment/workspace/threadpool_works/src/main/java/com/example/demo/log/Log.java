package com.example.demo.log;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Log {

	private String status;
	private char[] serial;
	private String socket_addr;
	private int socket_port;
	private SimpleDateFormat format1 = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
	Calendar cal = Calendar.getInstance();
	String time = format1.format(cal.getTime());
	
	//생성자
	public Log(String status, char[] serial, String socket_addr, int socket_port) {
		this.status = status;
		this.serial = serial;
		this.socket_addr = socket_addr;
		this.socket_port = socket_port;
	}
	
	


	@Override
	public String toString() {
		
		/*
		 * Log 파일 생성
		 * */
		String path = "C:\\Users\\RTNET\\Downloads\\java\\practice3\\threadpool_works\\Log";
		File folder = new File(path);
		if(!folder.exists()) {
			try {
				folder.mkdirs();
			}catch(Exception e) {
				e.printStackTrace();
			}
		}
		
		String path2 = "Log\\log.txt";
		File file = new File(path2);
		try{
			FileWriter fw = new FileWriter(file, true);
			fw.write("Log [status=" + status + ", serial=" + String.valueOf(serial) + ", socket_addr=" + socket_addr + ", socket_port="
				+ socket_port + ", time=" + time + "]\n");
			fw.close();
		}catch(IOException e) {
			e.printStackTrace();
		}
		
		/*
		 * Log
		 * */
		return "Log [status=" + status + ", serial=" + String.valueOf(serial) + ", socket_addr=" + socket_addr + ", socket_port="
				+ socket_port + ", time=" + time + "]";
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public char[] getSerial() {
		return serial;
	}


	public void setSerial(char[] serial) {
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

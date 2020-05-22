package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.demo.Repository.collectedRepo;
import com.example.demo.analysis.AnalysisWorks;
import com.example.demo.connection.ConnectionWrap;
import com.example.demo.log.Log;

@SpringBootApplication
@EnableScheduling
public class ThreadpoolWorksApplication implements CommandLineRunner{

	int i =0;
	@Autowired
	collectedRepo colRepo;
	
	public static void main(String[] args) throws Exception {
		
		SpringApplication.run(ThreadpoolWorksApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
		ServerSocket server;
		Socket socket;
		ThreadPoolExecutor ex = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
		try {
			System.out.println("tcp socket start!!!!");
			server = new ServerSocket();
			server.bind(new InetSocketAddress("localhost",7777));
			
			//분석스레드!!
			Thread th = new Thread(new AnalysisWorks(colRepo));
			th.setDaemon(true);
			th.start();
			
			while(true) {
				socket = server.accept();
				acceptedLog(socket);
				ex.execute(new ConnectionWrap(socket));
				
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	public void acceptedLog(Socket socket) throws IOException {

		byte bytes[] = new byte[10];
		InputStream in = socket.getInputStream();
		int read = in.read(bytes);
		char[] serial = new char[8];
		for(int i=0;i<read;i++) {
			serial[i] = (char) bytes[i];
		}
		Log log = new Log("연결수락", serial, socket.getInetAddress().toString(), socket.getPort());
		System.out.println(log.toString());
	}
}




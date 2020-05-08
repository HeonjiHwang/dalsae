package com.example.demo;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class server {

	public static void main(String[] args) {
		ServerSocket sock = null;
		Socket sock2 = null;
		
		try {
			//소켓 생성
			sock = new ServerSocket();
			//포트바인딩
			sock.bind(new InetSocketAddress("localhost", 7777));
			
			while(true) {
				System.out.println("[연결 기다리는 중]");

				//연결수락
				sock2 = sock.accept(); //클라이언트가 접속하기를 기다리고 접속되면 통신용 socket을 리턴
				//클라이언트 IP가져오기
				InetSocketAddress isa = (InetSocketAddress)sock2.getRemoteSocketAddress();
				System.out.println("[연결 수락]" + isa.getHostName());
				byte[] bytes = null;
				String msg = null;
				//데이터 받기
				InputStream is = sock2.getInputStream();
				bytes = new byte[100];
				int readByteCount = is.read(bytes);
				msg = new String(bytes,0,readByteCount,"UTF-8");
				System.out.println("[데이터 받기 성공]"+msg);
				
				//데이터 보내기
				OutputStream os = sock2.getOutputStream();
				msg = "Hello Client";
				bytes = msg.getBytes("UTF-8");
				os.write(bytes);
				os.flush();
				System.out.println("[데이터 보내기 성공]");
				
				//소켓 닫기
				is.close();
				os.close();
				sock2.close();
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		if(!sock.isClosed()) {
			try {
				sock.close();
			}catch(IOException e) {
				e.printStackTrace();
			}
		}
	}

}

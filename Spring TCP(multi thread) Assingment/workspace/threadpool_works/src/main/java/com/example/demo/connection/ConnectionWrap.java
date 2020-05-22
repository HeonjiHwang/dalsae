package com.example.demo.connection;

import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;

import com.example.demo.log.Log;
import com.example.demo.shared.CollectData;
import com.example.demo.shared.SharedData;

public class ConnectionWrap implements Runnable{
	private Socket socket;
	byte [] bytes = new byte[100];
	ArrayList<Object> listPop = new ArrayList<Object>();
	private char[] serial = new char[8];
	
	public ConnectionWrap(Socket socket) {
		this.socket = socket;
	}

	@Override
	public void run() {		
		try {
			while(true) {

				InputStream is = socket.getInputStream();
				int a = is.read(bytes);
				if(a == -1) {
					Log log = new Log("연결해제", serial, socket.getInetAddress().toString(), socket.getPort());
					System.out.println(log.toString());
					break;
				}
				
				//serial bytes to char[] 8bytes
				for(int i=0;i<8;i++) {
					serial[i] = (char) bytes[i];
				}
				//epoch bytes to integer 8bytes
				byte wait[] = new byte[8];
				for(int i=8;i<16;i++) {
					wait[i-8] = bytes[i];
				}
				long epoch = ByteBuffer.wrap(wait).order(ByteOrder.LITTLE_ENDIAN).getLong();
				
				//value bytes to float 4bytes
				byte val[] = new byte[4];
				for(int i=16;i<a;i++) {
					val[i-16] = bytes[i];
				}
				float value = ByteBuffer.wrap(val).order(ByteOrder.LITTLE_ENDIAN).getFloat();
								
				CollectData data = new CollectData(String.valueOf(serial), epoch, value);
				SharedData.getInstance().putData(data);
			}
		}catch(Exception e) {
			try {
				socket.close();
				Log log = new Log("연결해제", serial, socket.getInetAddress().toString(), socket.getPort());
				System.out.println(log.toString());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}
	
}

package com.example.demo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.DataInfo;
import com.example.demo.model.MeterInfo;
import com.example.demo.repository.DataRepository;
import com.example.demo.repository.MeterRepository;

@RestController
public class MeterController {
	
	 
	@Autowired
	private MeterRepository meterRepo;
	
	@Autowired
	private DataRepository dataRepo;
	
	
	@GetMapping("/meter/{meter_serial}")
	public ResponseEntity<DataInfo> getDatabySerial(@PathVariable(value="meter_serial") String meter_serial){
		
		MeterInfo meterinfo = meterRepo.findbySerial(meter_serial);
		Integer id = meterinfo.getMeter_id();
		DataInfo di = dataRepo.find(id);
		return ResponseEntity.ok().body(di);
	}
	
	//시리얼 등록 끝
	@PostMapping("/meter/{meter_serial}")
	public Map<String, Boolean> createMeterinfo(@Valid MeterInfo meterInfo) {
		Map<String, Boolean> response = new HashMap<>();
		String meter_serial = meterInfo.getMeter_serial();
		String old = meterRepo.oldserial(meter_serial);
		if(meter_serial.equals(old)) {
			response.put("already exited", Boolean.TRUE);
			System.out.println("Serial is already exited :: "+meter_serial);
		}else {
			meterRepo.save(meterInfo);
			response.put("updated", Boolean.TRUE);
			System.out.println("Create Serial Successfully! :: "+meter_serial);
		}
		return response;
	}
	
	@PutMapping(value="/meter/{meter_serial}")
	public ResponseEntity<DataInfo> updateData(@PathVariable(value="meter_serial")String meter_serial,@Valid DataInfo di){
		
		MeterInfo meterinfo = meterRepo.findbySerial(meter_serial);
		Integer meter_id = meterinfo.getMeter_id();
		LocalDateTime date = LocalDateTime.now(); 
		
		di.setMeter_id(meter_id);
		di.setCollect_time(date);
		DataInfo updateData = dataRepo.save(di);
		return ResponseEntity.ok(updateData);
	}
	
	
	@DeleteMapping("/meter/{meter_serial}")
	public Map<String, Boolean> deleteSerial(@PathVariable(value="meter_serial") String meter_serial) throws ResourceNotFoundException {

		Map<String, Boolean> response = new HashMap<>();
		MeterInfo mi = meterRepo.findbySerial(meter_serial);
		if(mi==null) {
			System.out.println("MeterInfo not found for meter_serial : "+meter_serial);
			response.put("not found", Boolean.TRUE);
		}
		else {
			meterRepo.delete(mi);
			response.put("deleted", Boolean.TRUE);
		}
		
		
		return response;
	}
	

	//시리얼 등록 끝
	@GetMapping("/summary")
	public String SummaryData(@Valid DataInfo di) {
		LocalDateTime date = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String formatDateTime = date.format(formatter);
		String serial = meterRepo.findserial();
		
		Integer id = meterRepo.findId();
		String a = "SERIAL : "+serial+", Time : "+formatDateTime+", AVG_PM25 : "+String.format("%.2f", dataRepo.avg_pm25(id))+", MAX_PM25 : "+dataRepo.max_pm25(id)+
				", AVG_HUM : "+String.format("%.2f", dataRepo.avg_hum(id))+", MAX_HUM : "+dataRepo.max_hum(id)+
				", AVG_TEMP : "+String.format("%.2f", dataRepo.avg_temp(id))+", MAX_TEMP : "+dataRepo.max_temp(id);
		return a;
	}
	
}

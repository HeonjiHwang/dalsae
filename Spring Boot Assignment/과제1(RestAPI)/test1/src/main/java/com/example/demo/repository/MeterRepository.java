package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.MeterInfo;

//DAO와 같은 Jpa에서 사용하는 DB layer접근자
@Repository
public interface MeterRepository extends JpaRepository<MeterInfo, String> {
	@Query(value = "SELECT * FROM METER_INFO WHERE METER_SERIAL=?1",nativeQuery=true)
	MeterInfo findbySerial(String meter_serial);
	
	@Query(value = "SELECT METER_ID FROM METER_INFO WHERE METER_SERIAL=?1",nativeQuery=true)
	Integer findId(String meter_serial);
	
	@Query(value = "SELECT METER_SERIAL FROM METER_INFO ORDER BY METER_ID DESC LIMIT 1",nativeQuery=true)
	String findserial();
	
	@Query(value = "SELECT METER_ID FROM METER_INFO ORDER BY METER_ID DESC LIMIT 1",nativeQuery=true)
	Integer findId();
		
	@Query(value = "SELECT METER_SERIAL FROM METER_INFO WHERE METER_SERIAL=?1", nativeQuery=true)
	String oldserial(String meter_serial);
	/*
	@Modifying
	@Query(value="INSERT INTO METER_INFO (METER_SERIAL) VALUES (?1) ON CONFLICT (METER_SERIAL) DO NOTHING", nativeQuery=true)
	MeterInfo select(String meter_serial);
	
	@Modifying
	@Query(value="INSERT INTO METER_INFO (METER_SERIAL) SELECT ?1 WHERE NOT EXISTS (SELECT METER_SERIAL FROM METER_INFO WHERE METER_SERIAL=?1)", nativeQuery=true)
	MeterInfo select2(String meter_serial);*/
}

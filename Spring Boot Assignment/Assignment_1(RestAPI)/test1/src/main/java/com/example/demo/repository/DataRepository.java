package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.DataInfo;

public interface DataRepository extends JpaRepository<DataInfo, String> {
	@Query(value = "SELECT * FROM METER_DATA WHERE METER_ID=?1 ORDER BY COLLECT_TIME DESC LIMIT 1",nativeQuery=true)
	DataInfo find(Integer meter_id);
	
	@Query(value = "SELECT AVG(PM25) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double avg_pm25(Integer id);
	
	@Query(value = "SELECT MAX(PM25) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double max_pm25(Integer id);
	
	@Query(value = "SELECT AVG(HUMIDITY) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double avg_hum(Integer id);
	
	@Query(value = "SELECT MAX(HUMIDITY) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double max_hum(Integer id);
	
	@Query(value = "SELECT AVG(TEMPERATURE) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double avg_temp(Integer id);
	
	@Query(value = "SELECT MAX(TEMPERATURE) FROM METER_DATA WHERE METER_ID = ?1", nativeQuery=true)
	double max_temp(Integer id);
}

package com.example.demo.date;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.AttributeConverter;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class CommonDateEntity implements AttributeConverter <LocalDateTime, Timestamp>{

	@Override
	public Timestamp convertToDatabaseColumn(LocalDateTime attribute) {
		// TODO Auto-generated method stub
		return attribute!= null ? Timestamp.valueOf(attribute) : null;
	}

	@Override
	public LocalDateTime convertToEntityAttribute(Timestamp dbData) {
		// TODO Auto-generated method stub
		return dbData != null ? dbData.toLocalDateTime() : null;
	}
	
}

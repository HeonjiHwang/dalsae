package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.collectedModel;

@Repository
public interface collectedRepo extends JpaRepository<collectedModel, String>{
}

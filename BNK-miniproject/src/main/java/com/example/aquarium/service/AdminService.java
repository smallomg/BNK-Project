package com.example.aquarium.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.aquarium.dao.IAdminDao;
import com.example.aquarium.dto.AdminDTO;

@Service
public class AdminService {

	@Autowired
	IAdminDao dao;
	
	public int adminLogin(AdminDTO adminDTO) {
		return dao.adminLogin(adminDTO);
	}
	
	public AdminDTO getAdmin(String aid) {
		return dao.getAdmin(aid);
	}
	
	public Map<String, Integer> getSalesOfday(String day){
		List<Map<String, Object>> result = dao.getSalesOfday(day);
		Map<String, Integer> changeResult = new LinkedHashMap<>();
		for(Map<String, Object> map : result) {
			String date = (String) map.get("SALES_DATE");
			int sales = ((BigDecimal) map.get("SALES")).intValue();
			changeResult.put(date, sales);
		}
		
		
		return changeResult;
	}
	
	public Map<String, Integer> getSalesOfmonth(String year){
		List<Map<String, Object>> result = dao.getSalesOfmonth(year);
		Map<String, Integer> changeResult = new LinkedHashMap<>();
		for(Map<String, Object> map : result) {
			String date = (String) map.get("SALES_MONTH");
			int sales = ((BigDecimal) map.get("TOTAL_SALES")).intValue();
			changeResult.put(date, sales);
		}
		System.out.println("changeResult: " + changeResult);
		
		return changeResult;
	}
}

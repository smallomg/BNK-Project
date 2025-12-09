package com.example.aquarium.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.aquarium.dto.AdminDTO;

@Mapper
public interface IAdminDao {
	
	int adminLogin(AdminDTO adminDTO);
	
	AdminDTO getAdmin(String aid);
	
	List<Map<String, Object>> getSalesOfday(String day);
	
	List<Map<String, Object>> getSalesOfmonth(String year);
}

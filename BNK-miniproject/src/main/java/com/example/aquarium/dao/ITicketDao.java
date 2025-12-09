package com.example.aquarium.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.aquarium.dto.TicketDTO;
@Mapper
public interface ITicketDao {
	//이용권 총 조회
	List<TicketDTO> selectAllTickets();
	//이용권 등록(관리자)
	int createTicket(@Param("t")TicketDTO ticket);
}

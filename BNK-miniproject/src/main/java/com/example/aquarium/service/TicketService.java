package com.example.aquarium.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.aquarium.dao.ITicketDao;
import com.example.aquarium.dto.TicketDTO;

@Service
public class TicketService {

    @Autowired
    private ITicketDao ticketDao;
    //이용권을 보고 등록하기 위해서 목록 보여주기
    public List<TicketDTO> getAllTickets() {
        return ticketDao.selectAllTickets();
    }
    //이용권 등록(관리자)
	public int createTicket(TicketDTO ticket) {
		return	ticketDao.createTicket(ticket);
	}
    
}


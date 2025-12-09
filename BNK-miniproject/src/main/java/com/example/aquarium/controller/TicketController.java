package com.example.aquarium.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.TicketDTO;
import com.example.aquarium.service.TicketService;
import com.example.aquarium.session.MemberSession;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    
    //이용권 목록 보여주기+주문까지 
    @GetMapping("/ticketlist")
    public String getTicketList(Model model) {
    	List<TicketDTO> list=ticketService.getAllTickets();
    	model.addAttribute("list",list);
        return "/ticket/ticketlist";
    }
    
    
    //주문 폼으로 이동
    @GetMapping("/orderform")
    public String orderForm(Model model) {
        List<TicketDTO> list = ticketService.getAllTickets();
        model.addAttribute("ticketList", list);
        return "/order/orderform";
    }
    
    @GetMapping("/checkSession")
    public String orderForm(RedirectAttributes rttr, HttpSession session) {
    	System.out.println(session.getAttribute("id"));
    	if(session.getAttribute("id") != null) {
    		return "forward:/order/orderform"; 
    	}
    	else {
    		rttr.addFlashAttribute("result", "no");
    		return "redirect:/ticket/ticketlist";
    	}
    	
    }
}


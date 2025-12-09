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
import com.example.aquarium.service.OrderService;
import com.example.aquarium.session.MemberSession;

@Controller
@RequestMapping("/order")
public class OrderController {
//id는 나중에 로그인한 아이디로 변경하면 된다
    @Autowired
    private OrderService orderService;
    

    // 이용권 목록 보여주기 (ticketlist.jsp 역할)
    @GetMapping("/ticket/ticketlist")
    public String showTicketList(Model model) {
        List<TicketDTO> list = orderService.getAllTickets();
        model.addAttribute("list", list);
        return "/ticket/ticketlist"; // ticketlist.jsp
    }

    // 주문폼 보여주기 (orderform.jsp)
    @GetMapping("/orderform")
    public String showOrderForm(Model model) {
        List<TicketDTO> list = orderService.getAllTickets();
        model.addAttribute("list", list);
        return "/order/orderform"; // orderform.jsp
    }

    // 주문 처리
    //티켓이 2개면 2개로 받을 수 있고,수량도 티켓 개수에 따라 여러 개가 될 수 있으므로 list타입으로 받았다
    @PostMapping("/ordercreate")
    public String createOrder(
            @RequestParam("id") String id,
            @RequestParam("ophone") String ophone,
            @RequestParam("tno[]") List<String> tnos,
            @RequestParam("amount[]") List<Integer> amounts) {
        // 0 이하 수량은 주문하지 않음
        orderService.createOrder(id, ophone, tnos, amounts);
        //로그인한 아이디를 가지고 list로 간다(로그인하고 주문을 해야 주문내역을 확인할 수 있기 때문이다)
        return "redirect:/order/orderlist"; // 주문내역 페이지로 리다이렉트
    }

    // 주문내역 조회 (예시)
    //MyBatis가 DB에서 가져오는 컬럼명을 key로 삼는데, 오라클은 컬럼명을 기본적으로 대문자로 리턴한다
    //resultType="map"일 때는 DTO처럼 자동 변환 안 해줌 (평소에 DTO타입으로 하면 자동변환을 해서 소문자로 써도 무방하다)
    @GetMapping("/orderlist")
    public String orderlist(Model model) {
    	//user01로 들어갈 아이디는 추후에 세션에 저장된 로그인아이디로 변경하자
        model.addAttribute("list", orderService.selectOrderItemsByMemberId("user01"));
        return "/order/orderlist"; // orderlist.jsp
    }
    
    
}

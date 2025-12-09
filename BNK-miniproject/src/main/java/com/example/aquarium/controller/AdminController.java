package com.example.aquarium.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.AdminDTO;
import com.example.aquarium.dto.QnaDTO;
import com.example.aquarium.dto.TicketDTO;
import com.example.aquarium.service.AdminService;
import com.example.aquarium.service.BoardService;
import com.example.aquarium.service.TicketService;
import com.example.aquarium.session.AdminSession;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminController {

	@Autowired
	AdminService service;
	
	@Autowired
	AdminSession adminsession;
	
	@Autowired
	BoardService boardService;
	
	@Autowired
    private TicketService ticketService; 
	
	@GetMapping("/admin")
	public String root(Model model) {
		List<QnaDTO> list = boardService.workList();
		model.addAttribute("qlist", list);
		return "admin/a_index";
	}
	
	@GetMapping("/admin/adminLoginForm")
	public String adminLoginForm() {
		return "admin/a_loginForm";
	}
	
	@PostMapping("/admin/adminLogin")
	public String adminLogin(AdminDTO adminDTO, RedirectAttributes rttr, HttpSession session) {
		int result = service.adminLogin(adminDTO);
		if(result == 1) {
			rttr.addFlashAttribute("Login", "0");
			AdminDTO admin = service.getAdmin(adminDTO.getAid());
			adminsession.login(admin, session);
			return "redirect:/admin";
		}
		else {
			rttr.addFlashAttribute("Login", "1");
			return "redirect:/admin/adminLoginForm";
		}
		
	}
	
	@GetMapping("/admin/logout")
	public String adminLogout(RedirectAttributes rttr, HttpSession session) {
		adminsession.logout(session);
		rttr.addFlashAttribute("logout", "ok");
		return "redirect:/admin";
	}
	
	@GetMapping("/admin/report")
	public String report() {
		return "admin/a_chart";
	}
	
	@PostMapping("/admin/drawDayChart")
	@ResponseBody
	public Map<String, Integer> drawDayChart(@RequestBody Map<String, String> dayMap){
		String day = (String)dayMap.get("sales_date");
		Map<String, Integer> result = service.getSalesOfday(day);
		return result;
	}
	
	@PostMapping("/admin/drawMonthChart")
	@ResponseBody
	public Map<String, Integer> drawMonthChart(@RequestBody Map<String, String> monthMap){
		System.out.println(monthMap);
		String year = (String)monthMap.get("year");
		System.out.println(year);
		Map<String, Integer> result = service.getSalesOfmonth(year);
		return result;
	}
	
	//이용권 등록 페이지로 이동(관리자만 가능)
    @GetMapping("/admin/ticketform")
    public String ticketform(Model model) {
    	List<TicketDTO> list=ticketService.getAllTickets();
    	model.addAttribute("list",list);
    	return "/admin/ticketform";
    }
    
    //이용권 등록한 걸 서비스로 넘겨서 실제로 등록-->이용권 목록뷰로 보내기
    @PostMapping("/admin/ticketcreate")
    public String ticketcreate(TicketDTO ticket, RedirectAttributes rttr) {
    	int result = ticketService.createTicket(ticket);
    	System.out.println(result);
    	if(result >= 1) {
    		rttr.addFlashAttribute("result", "ok");
    	}
    	return "redirect:/admin/ticketform";
    	
    }
}

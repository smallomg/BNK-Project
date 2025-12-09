package com.example.aquarium.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.JoinDTO;
import com.example.aquarium.dto.SearchLogDTO;
import com.example.aquarium.service.BoardService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

@Controller
public class SearchController {

	@Autowired
	private BoardService boardService;

	@GetMapping("/board/service_center/search")
	public String searchFaq(
	        @RequestParam("keyword") String keyword,
	        Model model) {

	    if (keyword == null || keyword.trim().isEmpty()) {
	        model.addAttribute("error", "검색어를 입력해주세요.");
	        return "redirect:/board/service_center/1"; // 기본 페이지로 리디렉션
	    }

	    List<JoinDTO> joinlist = boardService.getJoinList(keyword);
	    model.addAttribute("joinlist", joinlist);
	    model.addAttribute("keyword", keyword);

	    // 필요하면 검색 로그 저장
	    SearchLogDTO log = new SearchLogDTO();
	    log.setKeyword(keyword);
	    log.setToday(new Date());
	    boardService.insertKeyword(log);

	    return "/result"; // 검색 결과 전용 JSP
	}

	@GetMapping("/quiz")
	public String quiz() {
		return "quiz";
	}

}

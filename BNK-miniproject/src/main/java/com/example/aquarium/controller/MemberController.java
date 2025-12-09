package com.example.aquarium.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.aquarium.dto.MemberDto;
import com.example.aquarium.service.MemberService;
import com.example.aquarium.session.MemberSession;

import jakarta.servlet.http.HttpSession;

@Controller
public class MemberController {
	
	@Autowired
	public MemberService memberService;
	
	@Autowired
	private MemberSession memberSession;

	// 로그인
	@GetMapping("/loginForm")
	public String loginForm() {
		return "/loginForm";
	}
	
	@PostMapping("/login")
	public String login(@RequestParam("id")String id, @RequestParam("pw")String pw, RedirectAttributes rttr, HttpSession session) {
		if (memberService.loginCheck(id, pw)) {
			memberSession.setLoginSession(id);
			MemberDto member = memberService.getName(id);
			session.setAttribute("name", member.getName());
			return "redirect:/";
		} else {
			rttr.addFlashAttribute("loginMsg", "아이디 혹은 비밀번호를 다시 확인해 주세요!");
			return "redirect:/loginForm";
		}
	}
	
	@GetMapping("/loginFindForm")
	public String loginFindForm() {
		return "loginFindForm";
	}
	
	@PostMapping("/find")
	public String find(RedirectAttributes rttr) {
		rttr.addFlashAttribute("findMsg1", "응답1");
		rttr.addFlashAttribute("findMsg2", "응답2");
		return "redirect:/loginFindForm";
	}
	
	
	// 로그아웃
	@GetMapping("/logout")
	public String logout(RedirectAttributes rttr) {
		memberSession.logout();
		rttr.addFlashAttribute("logoutMsg", "로그아웃되었습니다.");
		return "redirect:/";
	}
	
	
	// 회원가입
	@GetMapping("/joinForm")
	public String joinForm() {
		return "joinForm";
	}
	
	@GetMapping("/btnIdCheck")
	@ResponseBody
	public int btnIdCheck(@RequestParam("id") String id) {
		return memberService.btnIdCheck(id);
	}
	
	@PostMapping("/join")
	public String join(MemberDto member) {
		if (memberService.joinCheck(member)) {
			return "redirect:/joinSuccess";
		} else {
			return "redirect:/joinForm";
		}
	}
	
	@GetMapping("/joinSuccess")
	public String joinSuccess() {
		return "joinSuccess";
	}
}

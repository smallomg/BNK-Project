package com.example.aquarium.session;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import com.example.aquarium.dto.AdminDTO;

import jakarta.servlet.http.HttpSession;

@Component
@SessionScope
public class AdminSession {
	private AdminDTO loginAdmin; //로그인 관리자 저장용 객체
	private HttpSession session;
	
	
	//로그인 처리
	public void login(AdminDTO admin, HttpSession adminsession) {
		session = adminsession;
		loginAdmin = admin;
		session.setAttribute("aid", loginAdmin.getAid());
		session.setAttribute("aname", loginAdmin.getAname());
	}
	//로그아웃 처리
	public void logout(HttpSession adminsession) {
		session = adminsession;
		loginAdmin = null;
		session.invalidate();
	}
	//현재 로그인 여부 확인
	public boolean isLoggedIn() {
		if(loginAdmin == null) {
			return false;
		}
		else return true;
	}
	//로그인 사용자 정보 조회
	public AdminDTO getLoginUser() {
		return loginAdmin;
	}
}

package com.example.aquarium.session;

import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpSession;

@Component
public class MemberSession {
	
	// 필드, 생성자
	private final HttpSession session;
	
	public MemberSession(HttpSession session) {
		this.session = session;
	}
	
	// 메서드
	public void setLoginSession(String id) { // 로그인
		session.setAttribute("id", id);
	}
	
	public void logout() { // 로그아웃
		session.invalidate();
	}
	
	//현재 로그인 여부 확인
	public boolean isLoggedIn() {
		if(session == null) {
			return false;
		}
		else return true;
	}
	
	public String getId() {
		return (String) session.getAttribute("id");
	}
}

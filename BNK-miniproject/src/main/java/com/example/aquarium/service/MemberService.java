package com.example.aquarium.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.aquarium.dao.IMemberDao;
import com.example.aquarium.dto.MemberDto;

@Service
public class MemberService {
	
	@Autowired
	public IMemberDao memberDao;
	
	 // 제외할 특수문자 목록
    private static final String excludeChars = "`~?-_+={}[]|\\:;\"'<>,./";
	
	// 로그인
	public boolean loginCheck(String id, String pw) {
		
		// 아이디
		if (memberDao.loginId(id) != 1) {
			return false;
		}
		
		// 비밀번호 db 조회
		String encryptedPw = memberDao.loginSecretPw(id);
		if (encryptedPw == null) {
			return false;
		}
		
		// 조회된 비밀번호 => 짝수 인덱스만 호출
	    StringBuilder sb = new StringBuilder();
	    for (int i = 0; i < encryptedPw.length(); i += 2) {
	        char c = encryptedPw.charAt(i);
	        
	        if(excludeChars.indexOf(c) == -1) {
	        	sb.append(c);
	        }
	    }
	    System.out.println("기존 : " + sb.toString() + ", 입력 : " + pw);
	    return pw.equals(sb.toString());
	    
	}
	
	public MemberDto getName(String id) {
		return memberDao.getName(id);
	}
	
	// 회원가입
	public int btnIdCheck(String id) { // 아이디 중복 확인
		int result = memberDao.joinIdCheck(id); 
		System.out.println("id : " + id + ", result : " + result);
		if (result == 1) {
			return 0; // 중복
		} else {
			return 1; // 사용 가능
		}
	}
	
	public boolean joinCheck(MemberDto member) {
		int result = memberDao.join(member);
		if (result == 1) {
			return true;
		} else {
			return false;
		}
	}
}

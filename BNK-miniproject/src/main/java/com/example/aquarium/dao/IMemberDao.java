package com.example.aquarium.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.aquarium.dto.MemberDto;

@Mapper
public interface IMemberDao {
	
	//로그인
	public int loginId(@Param("id")String id);
	public String loginSecretPw(@Param("id")String id);

	// 회원가입
	public int joinIdCheck(@Param("id")String id);
	public int join(@Param("member")MemberDto member);
	
	public MemberDto getName(String id);
}

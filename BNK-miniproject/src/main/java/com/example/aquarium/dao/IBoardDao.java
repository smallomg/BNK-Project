package com.example.aquarium.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.aquarium.dto.FaqDTO;
import com.example.aquarium.dto.JoinDTO;
import com.example.aquarium.dto.NoticeDTO;
import com.example.aquarium.dto.QnaDTO;
import com.example.aquarium.dto.SearchLogDTO;

@Mapper
public interface IBoardDao {
//	회원용
    void insertQna(QnaDTO qna);  // QnA 등록용

	List<QnaDTO> selectQnaList(@Param("id") String id, @Param("startRow")int startRow, @Param("endRow") int endRow); // Qna 목록 조회
	
	QnaDTO selectQnaByQno(String qno); // Qna 상세 조회

	List<FaqDTO> selectFaqList(@Param("startRow")int startRow, @Param("endRow") int endRow); // FAQ 목록 조회
	
	List<NoticeDTO> selectNoticeList(@Param("startRow") int startRow, @Param("endRow") int endRow); // notice 공지 목록 조회
	
	int ntotalcount(); // 공지사항 게시글의 총 개수 페이지 버튼의 갯수
	
	int ftotalcount(); // FAQ 게시글의 총 개수 페이지 버튼의 개수
	
	int qtotalcount(@Param("id") String id); // QNA 게시글의 총 개수 페이지 버튼의 개수
	
//	 관리자용
	void updateAnswer(QnaDTO qna); // 관리자 Qna 답변 업데이트

	void insertFaq(FaqDTO faq); // 관리자 FAQ 등록용

	void deleteFaq(String fno); // 관리자 FAQ 처리용

	void insertNotice(NoticeDTO notice); // 관리자 Notice 공지사항 등록용

	List<QnaDTO> selectQnaByQstatus(); //  관리자 Qna에서 대기만 보게하는 용

	void deleteNotice(String nid); // 관리자 Notice 공지사항 삭제용

	// 수정사항
	List<QnaDTO> selectQnaByComplete(); // 관리자 Qna 완료만 보여주기
	
	// 검색
	List<JoinDTO> selectJoinList(String keyword); // 검색 창 검색

	void insertKeyword(SearchLogDTO log); // 인기 검색어 등록하기

	List<SearchLogDTO> selectLogList(); // 인기 검색어 목록 보여주기

	

	



	

	

	
}

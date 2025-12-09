<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>

<style>
	ul{
		list-style-type: none;
	}
	p{
		font-weight: bold;
	}
</style>

<h1><a href="/admin">Green 아쿠아리움 관리자 페이지</a></h1>
<ul>
	<c:choose>
	<c:when test="${not empty sessionScope.aid}"> <%--로그인 했을 때 메뉴 --%>
	 	<li><a href="/admin/logout">로그아웃</a></li>
	 	<li><a href="/admin/noticeList">공지사항 현황 확인</a></li>
	 	<li><a href="/admin/faqList">FAQ현황 확인</a></li>
	 	<li><a href="/admin/qnaList">Q&A현황 확인</a></li>
	 	<li><a href="/admin/ticketform">이용권 등록</a></li>
	 	<li><a href="/admin/report">보고서</a></li>
	 	<li><p>[${sessionScope.aname}] 관리자님 환영합니다 🤗🤗</p></li>
	</c:when>
	<c:otherwise>	<%--비회원 메뉴 --%>
		<li><a href="">Green 아쿠아리움 바로가기</a></li>
		<li><a href="/admin/adminLoginForm">로그인</a></li>
	</c:otherwise>
</c:choose>
</ul>
<hr>
    
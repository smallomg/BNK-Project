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

<a href="/"><h1>Green 아쿠아리움</h1></a> 
<ul>
	<c:choose>
	<c:when test="${not empty sessionScope.id}"> <%--로그인 했을 때 메뉴 --%>
	 	<li><a href="/logout">로그아웃</a></li>
	 	<li><a href="">아쿠아리움 안내(이용안내)</a></li>
	 	<li><a href="/ticket/ticketlist">예약하기</a></li>
	 	<li><a href="/board/service_center/1">고객센터</a></li>
	 	<li><a href="/board/noticeList/1">공지사항</a></li>
	 	<li><p>[${sessionScope.name}] 회원님 환영합니다 🤗🤗</p></li>
	</c:when>
	<c:otherwise>	<%--비회원 메뉴 --%>
		<li><a href="/joinForm">회원가입</a></li>
		<li><a href="/loginForm">로그인</a></li>
		<li><a href="">아쿠아리움 안내(이용안내)</a></li>
		<li><a href="/ticket/ticketlist/1">예약하기</a></li>
		<li><a href="/board/service_center/1">고객센터</a></li>
		<li><a href="/board/noticeList/1">공지사항</a></li>
	</c:otherwise>
</c:choose>
</ul>
<hr>

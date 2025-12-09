<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>LoginForm</title>
</head>
<body>
<jsp:include page="header.jsp" />
<h1>LoginForm Page</h1>
<hr>
<form action="/login" method="POST">
	<table border="1">
		<tbody>
			<tr><th>아이디</th><td><input type="text" name="id"></td></tr>
			<tr><th>비밀번호</th><td><input type="password" name="pw"></td></tr>
			<tr><td colspan="2"><span>${loginMsg }</span></td></tr>
			<tr><td colspan="2"><input type="submit" value="로그인"></td></tr>
		</tbody>
	</table>
</form>
	
	<br>
	<a href="loginFindForm">아이디/비밀번호 찾기</a><br>
	혹시 회원이 아니신가요?&nbsp;<a href="joinForm">회원가입하러 가기</a><br>
	<br>
	+ 로그인 5번 실패 시 1분 간 잠금
	+ 자동 로그인
	+ 아이디/비밀번호 찾기 구체화 (인증번호 발송 등)
<c:if test="${not empty msg}">
	<script>
		alert("${msg}");
	</script>
</c:if>

</body>
</html>
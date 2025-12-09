<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>loginFindForm</title>
</head>
<body>
<jsp:include page="header.jsp" />
<h1>loginFindForm Page</h1>
<hr>
<form action="/find" method="POST">
	<table border="1">
		<h2>[아이디 찾기]</h2>
		<tbody>
			<tr><th>이름</th><td><input type="text" name="findId"></td><td rowspan="2"><input type="submit" value="조회"></td></tr>
			<tr><th>등록한 휴대폰 번호</th><td><input type="text" name="findPw"></td></tr>
			<tr><td colspan="3"><span>${findMsg1 }</span></td></tr>
		</tbody>
	</table>
</form>

<form action="/find" method="POST">
	<table border="1">
		<h2>[비밀번호 찾기]</h2>
		<tbody>
			<tr><th>이름</th><td><input type="text" name="findId"></td><td rowspan="2"><input type="submit" value="조회"></td></tr>
			<tr><th>아이디</th><td><input type="text" name="findPw"></td></tr>
			<tr><td colspan="3"><span>${findMsg2 }</span></td></tr>
		</tbody>
	</table>
</form>

</body>
</html>
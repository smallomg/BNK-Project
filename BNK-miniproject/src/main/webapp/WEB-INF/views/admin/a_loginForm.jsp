<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Admin Login Form</title>
<style>
	td{
		text-align: center;
	}
	th, td{
		padding: 10px;	
	}
</style>
</head>
<body>
<jsp:include page="a_header.jsp"/>
<h2>관리자 로그인</h2>
<form action="/admin/adminLogin" method="post">
	<table border=1>
		<tbody>
			<tr>
				<th>ID</th>
				<td><input type="text" name="aid" id="aid" placeholder="ID 입력" required></td>
			</tr>
			<tr>
				<th>PW</th>
				<td><input type="password" name="apw" id="apw" placeholder="PW 입력" required></td>
			</tr>
			<tr>
				<td colspan="2"><input type="submit" value="로그인"></td>
			</tr>
		</tbody>
	</table>
</form>
<c:if test="${not empty Login}">
	<script>
		alert("아이디 비밀번호를 확인하세요");
	</script>
</c:if>



</body>
</html>
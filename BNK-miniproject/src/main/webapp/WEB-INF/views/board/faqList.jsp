<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<jsp:include page="../header.jsp" />
	<h1>FAQ 목록 조회</h1>

	<table border="1">
		<tr>
			<th>번호</th>
			<th>제목</th>
			<th>내용</th>
		</tr>
		<c:forEach var="faq" items="${faqList}" varStatus="status">
			<tr>
				<td>${status.count}</td>
				<td>${faq.ftitle}</td>
				<td>${faq.fcontent}</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
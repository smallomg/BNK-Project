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
<jsp:include page="/WEB-INF/views/header.jsp" />
	<h1>검색 결과 창</h1>

	<c:if test="${empty joinlist}">
		<p>검색 결과가 없습니다.</p>
	</c:if>

	<c:if test="${not empty joinlist}">
		<table border="1">
			<tr>
				<th>출처</th>
				<th>제목</th>
				<th>내용</th>
			</tr>
			<c:forEach var="row" items="${joinlist}">
				<tr>
					<td>${row.source}</td>
					<td>${row.title}</td>
					<td>${row.content}</td>
				</tr>
			</c:forEach>
		</table>
	</c:if>
	
	<a href="/board/service_center/1">← 고객센터로 돌아가기</a>
</body>
</html>
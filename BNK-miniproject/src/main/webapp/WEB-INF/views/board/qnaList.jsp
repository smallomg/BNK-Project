<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QnA 목록</title>
</head>
<body>
	<jsp:include page="../header.jsp" />
	<h1>QnA 목록 사용자용</h1>

	<table border="1">
		<tr>
			<th>번호</th>
			<th>제목</th>
			<th>작성자</th>
			<th>작성일</th>
			<th>상태</th>
		</tr>
		<c:forEach var="qna" items="${qnaList}" varStatus="status">
			<tr>
				<td>${(currentPage - 1) * 5 + status.index + 1}</td>
				<td><a href="/board/view?qno=${qna.qno}"> ${qna.qtitle} </a></td>
				<td>${qna.id}</td>
				<td><fmt:formatDate value="${qna.qdate}"
						pattern="yyyy/MM/dd HH:mm" /></td>
				<td>${qna.qstatus}</td>
			</tr>
		</c:forEach>
	</table>
	<a href="/board/qnaForm">Q&A 등록</a>
	<br>
	<a href="/board/service_center/1">뒤로가기</a>

	<c:if test="${not empty msg}">
		<script>
			alert("${msg}");
		</script>

	</c:if>

	<!-- ✅ 페이지네이션 영역 -->
	<div style="margin-top: 20px; text-align: center;">
		<c:if test="${totalPages > 1}">
			<c:if test="${currentPage > 1}">
				<a class="page-btn" href="/board/qnaList/1">처음</a>
				<a class="page-btn" href="/board/qnaList/${currentPage - 1}">이전</a>
			</c:if>

			<c:forEach var="i" begin="1" end="${totalPages}">
				<c:choose>
					<c:when test="${i == currentPage}">
						<span class="page-btn page-current">${i}</span>
					</c:when>
					<c:otherwise>
						<a class="page-btn" href="/board/qnaList/${i}">${i}</a>
					</c:otherwise>
				</c:choose>
			</c:forEach>

			<c:if test="${currentPage < totalPages}">
				<a class="page-btn" href="/board/qnaList/${currentPage + 1}">다음</a>
				<a class="page-btn" href="/board/qnaList/${totalPages}">끝</a>
			</c:if>
		</c:if>
	</div>
</body>
</html>

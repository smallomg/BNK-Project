<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>공지사항</title>
<style>
.notice-content {
	display: none;
	background-color: #f9f9f9;
	padding: 10px;
	border-top: 1px solid #ccc;
	transition: all 0.3s ease;
}
.notice-title {
	cursor: pointer;
	color: blue;
	text-decoration: underline;
}
.page-btn {
	display: inline-block;
	padding: 6px 12px;
	margin: 2px;
	border: 1px solid #ccc;
	background-color: #f4f4f4;
	color: #333;
	text-decoration: none;
	border-radius: 4px;
}
.page-btn:hover {
	background-color: #ddd;
}
.page-current {
	background-color: #007bff;
	color: white;
	font-weight: bold;
	border: 1px solid #007bff;
}
</style>
<script>
	function toggleContent(index) {
		const content = document.getElementById('notice-content-' + index);
		if (content.style.display === 'block') {
			content.style.display = 'none';
		} else {
			content.style.display = 'block';
		}
	}
</script>
</head>
<body>
<jsp:include page="../header.jsp" />
<h1>📢 공지사항</h1>

<table border="1" width="100%" cellpadding="8" cellspacing="0">
	<tr>
		<th>번호</th>
		<th>제목</th>
		<th>작성일</th>
	</tr>
	<c:forEach var="notice" items="${noticeList}" varStatus="status">
		<tr>
			<td>${(currentPage - 1) * 5 + status.index + 1}</td>
			<td>
				<span class="notice-title" onclick="toggleContent(${status.index})">
					${notice.ntitle}
				</span>
			</td>
			<td>
				<fmt:formatDate value="${notice.ndate}" pattern="yyyy/MM/dd HH:mm" />
			</td>
		</tr>
		<tr>
			<td colspan="3">
				<div id="notice-content-${status.index}" class="notice-content">
					${notice.ncontent}
				</div>
			</td>
		</tr>
	</c:forEach>
</table>

<!-- ✅ 페이지네이션 영역 -->
<div style="margin-top: 20px; text-align: center;">
	<c:if test="${totalPages > 1}">
		<c:if test="${currentPage > 1}">
			<a class="page-btn" href="/board/noticeList/1">처음</a>
			<a class="page-btn" href="/board/noticeList/${currentPage - 1}">이전</a>
		</c:if>

		<c:forEach var="i" begin="1" end="${totalPages}">
			<c:choose>
				<c:when test="${i == currentPage}">
					<span class="page-btn page-current">${i}</span>
				</c:when>
				<c:otherwise>
					<a class="page-btn" href="/board/noticeList/${i}">${i}</a>
				</c:otherwise>
			</c:choose>
		</c:forEach>

		<c:if test="${currentPage < totalPages}">
			<a class="page-btn" href="/board/noticeList/${currentPage + 1}">다음</a>
			<a class="page-btn" href="/board/noticeList/${totalPages}">끝</a>
		</c:if>
	</c:if>
</div>

</body>
</html>

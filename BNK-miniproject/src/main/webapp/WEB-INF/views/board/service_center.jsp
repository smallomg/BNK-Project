<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>고객센터</title>
<style>
.faq-content {
	display: none;
	background-color: #f9f9f9;
	padding: 10px;
	border-top: 1px solid #ccc;
	transition: all 0.3s ease;
}

.faq-title {
	cursor: pointer;
	color: blue;
	text-decoration: underline;
}
</style>
<script>
	function toggleContent(index) {
		const content = document.getElementById('faq-content-' + index);
		if (content.style.display === 'block') {
			content.style.display = 'none'; // 다시 누르면 닫힘
		} else {
			content.style.display = 'block'; // 안 보이면 열림
		}
	}
</script>

</head>
<body>
	<jsp:include page="../header.jsp" />
	<h1>고객센터</h1>

	<h2>검색</h2>
	<form action="/board/service_center/search" method="get"
		onsubmit="return validateForm()">
		<input type="text" name="keyword" id="keyword"> <input
			type="submit" value="검색">
	</form>

	<h3>오늘의 인기 검색어</h3>
	<c:forEach var="log" items="${loglist}" varStatus="status">
   	${status.index+1}위 - ${log.keyword} ${log.count}회<br />
	</c:forEach>


	<a href="/board/qnaList/1">1대1 문의</a>

	<h2>FAQ 자주 찾는 도움말</h2>
	<table border="1">
		<tr>
			<th>번호</th>
			<th>제목</th>
		</tr>
		<c:forEach var="faq" items="${faqList}" varStatus="status">
			<tr>
				<td>${(currentPage - 1) * 5 + status.index + 1}</td>
				<td><span class="faq-title"
					onclick="toggleContent(${status.count})"> ${faq.ftitle} </span></td>
			</tr>
			<tr>
				<td colspan="2">
					<div id="faq-content-${status.count}" class="faq-content">
						${faq.fcontent}</div>
				</td>
			</tr>
		</c:forEach>
	</table>


	<!-- ✅ 페이지네이션 영역 -->
	<div style="margin-top: 20px; text-align: center;">
		<c:if test="${totalPages > 1}">
			<c:if test="${currentPage > 1}">
				<a class="page-btn" href="/board/service_center/1">처음</a>
				<a class="page-btn" href="/board/service_center/${currentPage - 1}">이전</a>
			</c:if>

			<c:forEach var="i" begin="1" end="${totalPages}">
				<c:choose>
					<c:when test="${i == currentPage}">
						<span class="page-btn page-current">${i}</span>
					</c:when>
					<c:otherwise>
						<a class="page-btn" href="/board/service_center/${i}">${i}</a>
					</c:otherwise>
				</c:choose>
			</c:forEach>

			<c:if test="${currentPage < totalPages}">
				<a class="page-btn" href="/board/service_center/${currentPage + 1}">다음</a>
				<a class="page-btn" href="/board/service_center/${totalPages}">끝</a>
			</c:if>
		</c:if>
	</div>
	<script>
		function valudateForm() {
			const keyword = document.getElementById("keyword").value.trim();
			if (keyword === "") {
				alert("키워드를 입력해주세요.")
				return false;
			}
			return true;
		}
	</script>
	
</body>
</html>

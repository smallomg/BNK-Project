<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>FAQ 목록 (관리자)</title>
</head>
<body>
	<jsp:include page="a_header.jsp" />
	<h1>FAQ 목록 (관리자 전용)</h1>

	<table border="1">
		<tr>
			<th>번호</th>
			<th>제목</th>
			<th>내용</th>
			<th>삭제</th>
		</tr>
		<c:forEach var="faq" items="${faqList}" varStatus="status">
			<tr>
				<td>${(currentPage - 1) * 5 + status.index + 1}</td>
				<td>${faq.ftitle}</td>
				<td>${faq.fcontent}</td>
				<td>
					<form action="/admin/faqDelete" method="post"
						onsubmit="return confirm('정말 삭제하시겠습니까?');">
						<input type="hidden" name="fno" value="${faq.fno}" /> <input
							type="submit" value="삭제" />
					</form>
				</td>
			</tr>
		</c:forEach>
	</table>
	<a href="/admin/faqForm">FAQ 등록</a>

	<c:if test="${not empty faqinsertMsg}">
		<script>
			alert("${faqinsertMsg}");
		</script>
	</c:if>
	
	<!-- ✅ 페이지네이션 영역 -->
	<div style="margin-top: 20px; text-align: center;">
		<c:if test="${totalPages > 1}">
			<c:if test="${currentPage > 1}">
				<a class="page-btn" href="/admin/faqList/1">처음</a>
				<a class="page-btn" href="/admin/faqList/${currentPage - 1}">이전</a>
			</c:if>

			<c:forEach var="i" begin="1" end="${totalPages}">
				<c:choose>
					<c:when test="${i == currentPage}">
						<span class="page-btn page-current">${i}</span>
					</c:when>
					<c:otherwise>
						<a class="page-btn" href="/admin/faqList/${i}">${i}</a>
					</c:otherwise>
				</c:choose>
			</c:forEach>

			<c:if test="${currentPage < totalPages}">
				<a class="page-btn" href="/admin/faqList/${currentPage + 1}">다음</a>
				<a class="page-btn" href="/admin/faqList/${totalPages}">끝</a>
			</c:if>
		</c:if>
	</div>
</body>
</html>

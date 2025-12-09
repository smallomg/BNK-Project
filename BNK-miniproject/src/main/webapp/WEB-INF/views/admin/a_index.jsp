<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Admin_Index</title>
</head>
<body>
<jsp:include page="a_header.jsp"/>

<c:if test="${not empty Login}">
	<script>
		alert("관리자님 환영합니다");
	</script>
</c:if>
<c:if test="${not empty logout}">
	<script>
		alert("정상적으로 로그아웃 되었습니다");
	</script>
</c:if>

<c:if test="${not empty sessionScope.aid}">
	<c:choose>
		<c:when test="${not empty qlist}">
			<h3>답변을 기다리고 있어요😎😎</h3>
			<table border=1>
				<tbody>
					<tr>
						<th>목차</th>
						<th colspan="2">제목</th>
					</tr>
					<c:forEach var="qlist" items="${qlist}" varStatus="status">
						<tr>
							<td>${status.count}</td>
							<td>${qlist.qtitle}</td>
							<td>
								<a href="/admin/answerForm?qno=${qlist.qno}"><input type="button" value="답글달기"></a>
							</td>
						</tr>
					</c:forEach>
				</tbody>
			</table>
		</c:when>
		<c:otherwise>
			<h4> ※ 답변가능한 Q&A가 없습니다 😁 ※ </h4>
		</c:otherwise>
	</c:choose>
</c:if>


</body>
</html>
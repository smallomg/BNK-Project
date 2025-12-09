<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>이용권 목록</title>
</head>
<body>
<jsp:include page="../header.jsp" />

<c:if test="${not empty result}">
	<script>
		alert("회원만 이용 가능한 서비스 입니다, 로그인 페이지로 이동합니다");
		location.href="/loginForm";
	</script>
</c:if>

<h2>이용권 목록</h2>
<table border="1">
    <tr>
        <th>번호</th>
        <th>이용권명</th>
        <th>가격</th>
        <th>내용</th>
    </tr>
    <c:forEach var="ticket" items="${list}" varStatus="status">
        <tr>
            <td>${status.index + 1}</td>
            <td>${ticket.tname}</td>
            <td>${ticket.tprice}</td>
            <td>${ticket.tcontent}</td>
        </tr>
    </c:forEach>
</table>

<a href="checkSession">주문하러 가기</a>

</body>
</html>

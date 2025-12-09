<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>주문 내역</title>
</head>
<body>
<jsp:include page="../header.jsp" />

<h2>주문 내역 조회</h2>

<table border="1">
    <tr>
        <th>주문번호</th>
        <th>주문일</th>
        <th>총금액</th>
        <th>이용권명</th>
        <th>수량</th>
    </tr>
    <c:forEach var="o" items="${list}">
    <tr>
        <td>${o.ONO}</td>
        <td>${o.ODATE}</td>
        <td>${o.TOTALPRICE}</td>
        <td>${o.TNAME}</td>
        <td>${o.AMOUNT}</td>
    </tr>
</c:forEach>
</table>
</body>
</html>

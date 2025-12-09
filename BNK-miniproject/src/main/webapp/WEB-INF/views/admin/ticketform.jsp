<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>이용권 등록</title>
</head>
<body>
<jsp:include page="a_header.jsp"/>
<c:if test="${not empty result}">
	<script>
		alert("등록이 완료되었습니다");
	</script>
</c:if>
<h1>이용권 등록 페이지 (관리자)</h1>

<h3>▶ 현재 이용권 목록</h3>
<table border="1">
    <tr>
        <th>번호</th>
        <th>이용권명</th>
        <th>가격</th>
        <th>설명</th>
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

<hr>

<h3>▶ 이용권 등록</h3>
		<form action="/admin/ticketcreate" method="post" onsubmit="return validateForm()">
		    <table border="1" cellpadding="5" cellspacing="0">
		        <tr>
		            <th>이용권명</th>
		            <td><input type="text" name="tname" required></td>
		        </tr>
		        <tr>
		            <th>가격</th>
		            <td><input type="text" name="tprice" required></td>
		        </tr>
		        <tr>
		            <th>내용</th>
		            <td><textarea name="tcontent" rows="3" cols="30"></textarea></td>
		        </tr>
		        <tr>
		            <td colspan="2" style="text-align:center;">
		                <input type="submit" value="등록">
		            </td>
		        </tr>
		    </table>
		</form>

<script>
		function validateForm() {
		    const tname = document.querySelector('input[name="tname"]').value.trim();
		    const tprice = document.querySelector('input[name="tprice"]').value.trim();
		
		    if (tname === "" || tprice === "") {
		        alert("이용권명과 가격은 반드시 입력해야 합니다.");
		        return false;
		    }
		
		    return true;
		}
</script>
</body>
</html>
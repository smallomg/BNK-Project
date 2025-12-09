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
<h2>QNA 질문 등록</h2>
	<form action="/board/qnaInsert" method="post">
    <table border="1">
        <tr>
            <td>제목</td>
            <td><input type="text" name="qtitle" placeholder="제목을 입력하세요" required /></td>
        </tr>
        <tr>
            <td>내용</td>
            <td><textarea name="qcontent" rows="5" placeholder="질문 내용을 입력하세요" required></textarea></td>
        </tr>
        <tr>
            <td>질문 유형</td>
            <td>
                <select name="qtype">
                    <option value="결제">결제</option>
                    <option value="서비스">서비스</option>
                    <option value="기타">기타</option>
                </select>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center;">
                <button type="submit">질문 등록</button>
            </td>
        </tr>
    </table>
    <a href="/board/qnaList/1">목록으로 되돌아가기</a>
</form>
<c:if test="${not empty msg}">
		<script>
			alert("${msg}");
		</script>
	</c:if>
</body>
</html>
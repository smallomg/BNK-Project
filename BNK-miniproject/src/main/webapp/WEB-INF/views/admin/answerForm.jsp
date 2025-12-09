<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Q&A Answer Form</title>
</head>
<body>
	<jsp:include page="a_header.jsp" />
	<h1>답변 내용</h1>

	  <p><strong>제목:</strong> ${qna.qtitle}</p>
	  <p><strong>내용:</strong> ${qna.qcontent}</p>
	  <p><strong>작성자:</strong> ${qna.id}</p>

	<form action="answerUpdate" method="post">
		<input type="hidden" name="qno" value="${qna.qno}" />
		<textarea name="qanswer" rows="5" cols="50" placeholder="답변을 입력하세요"></textarea>
		<br /> <input type="submit" value="답변 완료">
	</form>

</body>
</html>
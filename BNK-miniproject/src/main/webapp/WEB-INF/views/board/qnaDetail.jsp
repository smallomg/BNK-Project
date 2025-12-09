<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
<title>QnA 상세</title>
</head>
<body>
<jsp:include page="../header.jsp" />
	<h2>QnA 상세 보기</h2>

	<table border="1">
		<tr>
			<th>제목</th>
			<td>${qna.qtitle}</td>
		</tr>
		<tr>
			<th>작성자</th>
			<td>${qna.id}</td>
		</tr>
		<tr>
			<th>작성일</th>
			<td><fmt:formatDate value="${qna.qdate}" pattern="yyyy년 MM월 dd일" /></td>
		</tr>
		<tr>
			<th>상태</th>
			<td>${qna.qstatus}</td>
		</tr>
		<tr>
			<th>질문유형</th>
			<td>${qna.qtype}</td>
		</tr>
		<tr>
			<th>내용</th>
			<td>${qna.qcontent}</td>
		</tr>
		<tr>
			<th>답변내용</th>
			<td>${qna.qanswer}</td>
		</tr>
	</table>

	<a href="/board/qnaList/1">← 목록으로 돌아가기</a>
</body>
</html>

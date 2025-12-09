<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<jsp:include page="a_header.jsp"/>
	<h1>FAQ 등록 처리</h1>
	<form action="/admin/faqInsert" method="post">
		<table border="1">
			<tr>
				<td>제목</td>
				<td><input type="text" name="ftitle" placeholder="제목을 입력하세요"
					required /></td>
			</tr>
			<tr>
				<td>내용</td>
				<td><textarea name="fcontent" rows="5"
						placeholder="내용을 입력하세요" required></textarea></td>
			</tr>
			<tr>
				<td colspan="2" style="text-align: center;">
					<button type="submit">질문 등록</button>
				</td>
			</tr>
		</table>
	</form>
	<a href="/admin/faqList">목록으로 되돌아가기</a>
</body>
</html>
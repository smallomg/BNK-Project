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
	<h1>notice Insert 공지사항 등록</h1>

	<form action="noticeInsert" method="post">
		<table border="1">
			<tr>
				<td>제목</td>
				<td><input type="text" name="ntitle" placeholder="공지 제목을 입력하세요"
					required /></td>
			</tr>
			<tr>
				<td>내용</td>
				<td><input type="text" name="ncontent"
					placeholder="공지 내용을 입력하세요" required /></td>
			</tr>

			<tr>
				<td colspan="2" style="text-align: center;"><input
					type="submit" value="공지사항 등록"></td>
			</tr>
		</table>
	</form>

</body>
</html>
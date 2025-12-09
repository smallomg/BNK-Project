<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<jsp:include page="header.jsp" />
<h1>joinForm</h1>
<hr>
<form action="/join" method="POST" onsubmit="return submitForm()">
	<table border="1" width="700">
		<thead></thead>
		<tbody>
			<tr><th>아이디</th><td><input type="text" name="id" id="id" onkeyup="idCheck1()" required></td><td><button type="button" id="idBtn" onclick="idCheck2()">중복 확인</button> <span id="joinIdMsg">영문/숫자 (4~10글자)</span></td></tr>
			<tr><th>비밀번호</th><td><input type="password" name="pw" id="pw" onkeyup="pwCheck1()" required></td><td><span id="joinPwMsg"> 영자로 시작, 영문/숫자/특수문자 조합 (10~15글자)</span></td></tr>
			<tr><th>비밀번호 확인</th><td><input type="password" name="pwCheck" id="pwCheck" onkeyup="pwCheck2()" required></td><td><span id="joinPwCheckMsg">확인을 위해 비밀번호를 다시 입력해 주세요.</span></td></tr>
			<tr><th>이름</th><td><input type="text" name="name" required></td></tr>
			<tr><th>휴대폰 번호</th><td><input type="text" name="phone" placeholder="010-1234-5678" required></td></tr>
			<tr><th>생년월일</th><td><input type="date" name="birth" placeholder="ex) 1988년 5월 3일 → 19880503" required></td></tr>
		</tbody>
	</table>
			<br>
			※ 아래는 간단한 설문 조사입니다. 서비스 개선을 위해 답변해 주시면 감사하겠습니다.
			<br>
			<input type="radio" name="aim" value="simple" required> 단순 방문
			<input type="radio" name="aim" value="family"> 가족 나들이
			<input type="radio" name="aim" value="date"> 데이트
			<input type="radio" name="aim" value="group"> 단체 체험학습
			<input type="radio" name="aim" value="etc" onclick="focusEtc()"> 기타 <input type="text" name="aimContent" id="aimContent">
			<br><br>
			<button type="submit" id="submitBtn">등록</button>
</form>

<br>
+ 휴대폰 번호 패턴 검사
+ 생년월일 (연도 제한)
+ 암호화

<script>

	let isCheckId = 0;
	let isCheckPw = 0;

	// 유효성검사 - 아이디 (입력 조건, 중복 확인)
	const idBtn = document.getElementById("idBtn");
	idBtn.disabled = true; // 중복확인 버튼 비활성화
	
	function idCheck1(){
		const id = document.getElementById("id").value;
		const joinId = document.getElementById("joinIdMsg");
		
		const regex = /^[a-zA-Z0-9]{4,10}$/; // 영문자+숫자, 길이 모두 충족한 경우
		const idLengthOnly = /^.{4,10}$/; // 길이만 충족한 경우
		const idLettersOnly = /^[a-zA-Z0-9]+$/; // 영문자+숫자만 충족한 경우
		isCheckId = 0;
		updateSubmitBtn();
		
	    if (!id) {
	        joinId.innerText = "영문/숫자 (4~10글자)";
	        joinId.style.color = "black";
	        idBtn.disabled = true; // 중복확인 버튼 비활성화
	    } else if (regex.test(id)) {
	        joinId.innerText = "왼쪽 버튼을 클릭해 주세요.";
	        joinId.style.color = "green";
	        idBtn.disabled = false; // 중복확인 버튼 활성화
	    } else if (!idLettersOnly.test(id)) {
	        joinId.innerText = "영문/숫자만 입력해 주세요.";
	        joinId.style.color = "red";
	        idBtn.disabled = true; // 중복확인 버튼 비활성화
	    } else if (!idLengthOnly.test(id)) {
	        joinId.innerText = "4~10자 사이로 입력해 주세요.";
	        joinId.style.color = "red";
	        idBtn.disabled = true; // 중복확인 버튼 비활성화
	    } else {
	        joinId.innerText = "형식이 올바르지 않습니다.";
	        joinId.style.color = "red";
	        idBtn.disabled = true; // 중복확인 버튼 비활성화
	    }
	}
	
	function idCheck2(){
		const id = document.getElementById("id").value;
		const joinId = document.getElementById("joinIdMsg");
		
		fetch(`/btnIdCheck?id=` + id)
			.then(response => response.text())
			.then(result => {
				if (result === "1"){
					joinId.innerText = "사용 가능한 아이디입니다.";
					joinId.style.color = "blue";
					isCheckId = 1;
					updateSubmitBtn();
				} else {
					joinId.innerText = "이미 사용 중인 아이디입니다.";
					joinId.style.color = "red";
					isCheckId = 0;
					updateSubmitBtn();
				}
			})
			.catch(error => {
				joinId.innerText = "서버 문제가 발생했습니다.";
				joinId.style.color = "red";
				isCheckId = 0;
				updateSubmitBtn();
			})
	}
		
	// 유효성검사 - 비밀번호 (입력 조건, 재확인)
	function pwCheck1(){
		const id = document.getElementById("id").value;
		const pw = document.getElementById("pw").value;
		const joinPw = document.getElementById("joinPwMsg");
		
		const regex = /^[a-zA-Z][a-zA-Z0-9!@#$%^&*]{9,14}$/; // 영자로 시작, 영문/숫자/특수문자 조합 조건 모두 충족
		const pwStartOnly = /^[a-zA-Z]/; // 영자로 시작하는 조건만 충족
		const pwAlphabetOnly = /[a-zA-Z]/; // 영어 충족
		const pwNumberOnly = /[0-9]/; // 숫자 충족
		const pwSpecialOnly = /[^a-zA-Z0-9]/; // 특수문자 충족
		const pwLengthOnly = /^.{10,15}$/; // 길이 조건만 충족
		isCheckPw = 0;
		updateSubmitBtn();
		
		 if (!pw) {
		        joinPw.innerText = "영자로 시작, 영문/숫자/특수문자 조합 (10~15글자)";
		        joinPw.style.color = "black";
		    } else if (regex.test(pw)){
		    	joinPw.innerText = "사용 가능한 비밀번호입니다.";
		        joinPw.style.color = "blue";
		    } else if (id === pw){
		    	joinPw.innerText = "아이디와는 다른 비밀번호로 설정해 주세요.";
		        joinPw.style.color = "red";
		    } else if (!pwStartOnly.test(pw)){
		    	joinPw.innerText = "영자로 시작해 주세요.";
		        joinPw.style.color = "red";
		    } else if (!(pwAlphabetOnly.test(pw) && pwNumberOnly.test(pw) && pwSpecialOnly.test(pw))){
		    	if (!pwAlphabetOnly.test(pw)){
		    		joinPw.innerText = "영자를 추가해 주세요.";
			        joinPw.style.color = "red";
		    	} else if (!pwNumberOnly.test(pw)){
		    		joinPw.innerText = "숫자를 추가해 주세요.";
			        joinPw.style.color = "red";
		    	} else if (!pwSpecialOnly.test(pw)){
		    		joinPw.innerText = "특수문자를 추가해 주세요.";
			        joinPw.style.color = "red";
		    	} else {
		    		joinPw.innerText = "영문/숫자/특수문자를 조합해서 입력해 주세요.";
			        joinPw.style.color = "red";
		    	}
		    } else if (!pwLengthOnly.test(pw)){
		    	joinPw.innerText = "10~15자 사이로 입력해 주세요.";
		        joinPw.style.color = "red";
		    } else {
		    	joinPw.innerText = "형식이 올바르지 않습니다.";
		        joinPw.style.color = "red";
		    }
		
	}
	
	function pwCheck2(){
		const pw = document.getElementById("pw").value;
		const pwCheck = document.getElementById("pwCheck").value;
		const joinPwCheck = document.getElementById("joinPwCheckMsg");
		
		if (!pwCheck){
			joinPwCheck.innerText = "확인을 위해 비밀번호를 다시 입력해 주세요.";
	        joinPwCheck.style.color = "black";
	        isCheckPw = 0;
	        updateSubmitBtn();
		} else if (pw === pwCheck){
			joinPwCheck.innerText = "확인되었습니다.";
	        joinPwCheck.style.color = "blue";
	        isCheckPw = 1;
	        updateSubmitBtn();
		} else {
			joinPwCheck.innerText = "설정한 비밀번호와 맞지 않습니다. 다시 확인해 주세요.";
	        joinPwCheck.style.color = "red";
	        isCheckPw = 0;
	        updateSubmitBtn();
		}
	}
	
	// 설문 조사
	function focusEtc(){
		document.getElementById("aimContent").focus();
	}

	//제출
	const inputsRequired = document.querySelectorAll("input[required]");
	const submitBtn = document.getElementById("submitBtn");
	submitBtn.disabled = true; // 제출 버튼 비활성화
	
	function updateSubmitBtn(){
		let requiredAll = true;
		
		for (const input of inputsRequired){
			if(!input.value.trim()){ // 필수 입력값 중 미입력한 사항 존재
				requiredAll = false;
				break;
			}
		}
		
		if (isCheckId == 1 && isCheckPw == 1 && requiredAll){
			submitBtn.disabled = false;
		} else {
			submitBtn.disabled = true;
		}
	}
	
	inputsRequired.forEach(input => {
		input.addEventListener("input", updateSubmitBtn);
	});
	
	// 제출 버튼 클릭 시 알림창 (+ 설문조사 체크 여부 확인)
	function submitForm(){
		let surveyChecked = false;
		const survey = document.querySelectorAll("input[name='aim']");
		const radioEtc = document.querySelector("input[value='etc']");
		const radioEtcContent = document.querySelector("input[name='aimContent']").value.trim();
		
		const submitPw = document.getElementById('pw');
	    const encryptedPw = secretPw(submitPw.value);
	    
	    submitPw.value = encryptedPw;
		
		// 기타 항목 선택 시
		if (radioEtc.checked && !radioEtcContent){
			alert("기타 내용을 입력해 주세요.")
			document.getElementById("aimContent").focus();
			return false;
		}
		
		if (radioEtc.checked && radioEtcContent){
			survey.forEach(radio => {
				radio.removeAttribute("name");
			});
			
			const hiddenEtc = document.createElement("input");
			hiddenEtc.type = "hidden";
			hiddenEtc.name = "aim";
			hiddenEtc.value = radioEtcContent;
			document.querySelector("form").appendChild(hiddenEtc);
		}
		
		return true;
	}
	
	// 비밀번호 암호화
	function secretPw(pw){
		
		// 홀수자리 = 난수
	    function getRandomChar() {
	        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	        return chars.charAt(Math.floor(Math.random() * chars.length));
	    }
		
		// 짝수자리 = 비밀번호값 + (남는 자리 : 영문/숫자/특수문자 외 기호 삽입)
	    const extraChars = "`~?-_+={}[]|\\:;\"'<>,./";
	    
	    // 배열
	    const length = 30;
	    let result = new Array(length).fill('');
	    
	    for (let i = 0; i < pw.length; i++){
	    	
	    	let indexEven = i * 2;
	    	if (indexEven >= length){
	    		break;
	    	}
	    	result[indexEven] = pw.charAt(i); // 비밀번호값 대입
	    }
	    
	    for (let i = pw.length * 2; i < length; i += 2){
	    	result[i] = extraChars.charAt(Math.floor(Math.random() * extraChars.length));
	    }
	    
	    for (let i = 1; i < length; i += 2) {
	        result[i] = getRandomChar();
	    }
	    
	    return result.join('');
	}

	
</script>
</body>
</html>
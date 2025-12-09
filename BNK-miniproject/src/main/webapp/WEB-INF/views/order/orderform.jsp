<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
    <title>주문하기</title>
    <style>
        /* 기본 스타일 생략 (아이콘, 모달, 테이블 등) */
    </style>
</head>
<body>
<jsp:include page="../header.jsp" />

<h2>예약하기</h2>

<!-- 장바구니 아이콘 -->
<div id="cartIcon" style="cursor:pointer;">
    🛒 <span id="cartCount">0</span>
</div>

<!-- 장바구니 모달 -->
<div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:#00000088; z-index:999;"></div>
<div id="cartModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:20px; border:1px solid #ccc; z-index:1000;">
    <h3>장바구니</h3>
    <form id="cartForm" method="post" action="/order/ordercreate" onsubmit="return syncPhoneToCart();">
        <input type="hidden" name="id" value="user01">
        <input type="hidden" id="cartPhone" name="ophone">
        <table border="1" id="cartTable">
            <tr><th>이용권명</th><th>수량</th></tr>
        </table>
        <br>
        <button type="submit">주문하기</button>
        <button type="button" onclick="closeCartModal()">닫기</button>
    </form>
</div>

<!-- 일반 주문 폼 -->
<form id="mainForm" method="post" action="/order/ordercreate" onsubmit="return disableZeroInputs();">
    <input type="hidden" name="id" value="user01" />
    전화번호: <input type="text" id="phoneInput" name="ophone" required><br><br>

    <table border="1">
        <tr><th>번호</th><th>이용권명</th><th>가격</th><th>수량</th><th>장바구니</th></tr>
        <c:forEach var="ticket" items="${list}" varStatus="status">
            <tr>
                <td>${status.index + 1}</td>
                <td>${ticket.tname}</td>
                <td>${ticket.tprice}원</td>
                <td>
                    <input type="hidden" name="tno[]" value="${ticket.tno}">
                    <input type="number" id="amount_${ticket.tno}" name="amount[]" min="0" value="0" style="width:50px;">
                </td>
                <td><button type="button" class="addCartBtn" data-tno="${ticket.tno}" data-tname="${fn:escapeXml(ticket.tname)}">추가</button></td>
            </tr>
        </c:forEach>
    </table>
    <br>
    <button type="submit">주문하기</button>
</form>

<script>
    const cart = [];

    // 장바구니 버튼 기능
    document.querySelectorAll(".addCartBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tno = btn.dataset.tno;
            const tname = btn.dataset.tname;
            const amount = parseInt(document.getElementById("amount_" + tno).value);

            if (!amount || amount <= 0) {
                alert("1개 이상 입력해 주세요.");
                return;
            }

            const existing = cart.find(item => item.tno === tno);
            if (existing) {
                existing.amount += amount;
            } else {
                cart.push({ tno, tname, amount });
            }
            updateCartUI();
        });
    });
    
	
    function updateCartUI() {
    	console.log(cart);
        document.getElementById("cartCount").innerText = cart.reduce((sum, item) => sum + item.amount, 0);

        const table = document.getElementById("cartTable");
        table.innerHTML = "<tr><th>이용권명</th><th>수량</th></tr>";

        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    \${item.tname}
                    <input type="hidden" name="tno[]" value="${item.tno}" />
                </td>
                <td>
                    \${item.amount}
                    <input type="hidden" name="amount[]" value="${item.amount}" />
                </td>
            `;
            table.appendChild(row);
        });
    }

    // 장바구니 아이콘 클릭 시 모달 열기
    document.getElementById("cartIcon").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("장바구니가 비어있습니다.");
            return;
        }

        document.getElementById("cartPhone").value = document.getElementById("phoneInput").value;
        //장바구니 모달을 여는 시점에 table에 채워질 내용을 찾는 updateCartUI()를 찾아야 한다(추가했어 여기에!)
        updateCartUI();
        document.getElementById("overlay").style.display = "block";
        document.getElementById("cartModal").style.display = "block";
    });

    // 모달 닫기
    function closeCartModal() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("cartModal").style.display = "none";
    }

    // 전화번호 동기화
    function syncPhoneToCart() {
        const phone = document.getElementById("phoneInput").value.trim();
        if (phone === "") {
            alert("전화번호를 입력하세요.");
            return false;
        }
        document.getElementById("cartPhone").value = phone;
        return true;
    }

    // 수량 0인 입력 제거
    function disableZeroInputs() {
        const form = document.getElementById("mainForm");
        form.querySelectorAll("input[name='amount[]']").forEach((amt, i) => {
            if (parseInt(amt.value) === 0) {
                amt.disabled = true;
                form.querySelectorAll("input[name='tno[]']")[i].disabled = true;
            }
        });
        return true;
    }
</script>

</body>
</html>

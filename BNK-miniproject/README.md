# BNK 아쿠아리움 예약 시스템 (Mini Project)

> **"부산의 바다를 담다, 편리한 예약과 관람을 위한 아쿠아리움 웹 서비스"**  
> 실제 운영 중인 아쿠아리움 사이트를 벤치마킹하여, 회원가입부터 티켓 예매, 관리자 통계까지 구현한 웹 프로젝트입니다.

<br>

## Project Info(프로젝트 정보)
- **프로젝트 명:** BNK 아쿠아리움 
- **개발 기간:** 2025.05.21 ~ 2025.05.27 (7일)
- **참여 인원:** 4명 (풀스택 개발)
- **주요 목표:** 
  - Spring Framework와 MyBatis를 활용한 안정적인 웹 애플리케이션 구축
  - 사용자 편의를 위한 직관적인 티켓 예매 및 발급 시스템 구현
  - Chart.js를 활용한 관리자 데이터 시각화

<br>

## Tech Stack(기술 스택)

### Backend(백엔드)
<img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logo=fluentd&logoColor=white"> <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white">

### Frontend(프런트엔드)
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/JSTL-black?style=for-the-badge&logo=java&logoColor=white">

### Tools & Library(도구 및 라이브러리)
<img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"> <img src="https://img.shields.io/badge/Eclipse-2C2255?style=for-the-badge&logo=eclipse&logoColor=white"> <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">

<br>

## ERD & Database Logic (데이터베이스 설계)
<!-- 이미지를 넣으시려면 아래 경로를 수정하세요 -->
<img width="791" height="463" alt="image" src="https://github.com/user-attachments/assets/f72eb8da-e004-40d2-b899-289967345a6c" />


데이터 무결성을 위해 **회원, 상품, 주문, 게시판** 영역을 명확히 분리하여 설계했습니다.

### 1. User & Admin (사용자 관리)
- **`MEMBER`**: 회원 정보를 관리하며, `ID`를 기본키(PK)로 사용하여 다른 테이블과 참조 관계를 맺습니다.
- **`ADMINS`**: 별도의 관리자 테이블을 두어 일반 회원과 권한을 물리적으로 분리했습니다.

### 2. Commerce System (주문 및 결제)
- **`TICKET`**: 판매되는 이용권의 종류와 가격 정보를 관리합니다.
- **`ORDERS` (주문 마스터)**: 누가(Member FK), 언제, 얼마를 결제했는지 **주문의 전체적인 요약 정보**를 저장합니다.
- **`ITEMS` (주문 상세)**: 하나의 주문(`ORDERS`)에 여러 종류의 티켓(`TICKET`)이 포함될 수 있도록 **1:N 관계를 해소하는 연결 테이블**입니다.

### 3. CS & Board (고객 지원)
- **`QNA`**: 회원(`ID`)과 연동된 1:1 문의 테이블로, 답변 상태(`qstatus`)와 문의 유형(`qtype`)을 관리합니다.
- **`FAQ` / `NOTICE`**: 자주 묻는 질문과 공지사항을 관리하는 독립적인 테이블입니다.

### 4. Analytics (데이터 분석)
- **`SEARCH_LOG`**: 사용자가 검색한 키워드와 날짜를 저장하여, 추후 **인기 검색어 분석 및 추천 서비스**의 기초 데이터로 활용합니다.

<br>

## Key Features (주요 특징)

| 구분 | 기능 | 설명 |
| --- | --- | --- |
| **회원** | 인증/보안 | 비밀번호 **양방향 암호화** 및 세션 기반의 로그인/로그아웃 처리 |
| **주문** | **주문번호** | Oracle **Sequence와 LPAD**를 활용하여 읽기 쉬운 주문번호(예: `R001`) 자동 생성 |
| **게시판** | **검색/추천** | **MyBatis 동적 쿼리**를 활용한 다중 조건 검색 및 `SEARCH_LOG` 기반 데이터 수집 |
| **관리자** | 통계/시각화 | **Chart.js**를 활용하여 일별 매출 및 연령별 회원 분포 시각화 |

<br>

## My Role (담당 업무)

**담당 역할: 게시판(Board) 기능 전반 및 통합 검색 구현**

### 1. 게시판(QnA/FAQ/Notice) CRUD 구현
- **MVC 패턴 & MyBatis 활용**: `Controller` - `Service` - `DAO` 구조로 역할을 분리하여 유지보수성 향상
- **QnA (1:1 문의)**: 회원이 문의 글 작성 시 관리자가 답글을 달 수 있는 구조 설계 및 `qstatus`를 통한 답변 대기/완료 상태 관리
- **템플릿 모듈화**: `jsp:include`를 활용하여 헤더, 푸터, 사이드바 등 반복되는 UI 요소를 모듈화

### 2. 다중 조건 검색 (Search)
- **동적 쿼리(Dynamic SQL)**: MyBatis의 `<if>`, `<choose>` 태그를 활용하여 제목, 내용, 작성자 등 **다양한 조건**으로 데이터를 필터링하는 검색 로직 구현
- **검색 로그 저장**: 사용자가 검색을 수행할 때 `SEARCH_LOG` 테이블에 키워드를 `INSERT`하여 관리자 통계 자료 마련

<br>

## Trouble Shooting (성장 경험)

### 문제 상황: 주문 데이터의 정규화 이슈
하나의 주문 번호(Order)에 '성인 입장권 2매', '어린이 입장권 1매' 등 서로 다른 상품이 섞여 있을 때, 이를 하나의 테이블(`ORDERS`)에 모두 담을 수 없는 문제가 있었습니다.

### 해결 과정 (DB 설계 개선)
- **테이블 분리**: 주문 정보를 담는 `ORDERS` 테이블과, 실제 어떤 상품을 몇 개 샀는지 담는 `ITEMS` 테이블로 분리했습니다.
- **관계 설정**: `ITEMS` 테이블이 `ORDERS`의 주문번호(`ono`)와 `TICKET`의 상품번호(`tno`)를 동시에 참조(FK)하도록 설계하여, **N:M 관계를 1:N 관계로 풀어내는 DB 모델링**을 경험했습니다.
- **주문번호 생성**: 단순 숫자가 아닌 `R` + `001` 형태의 비즈니스 로직이 담긴 주문번호 생성을 위해 Oracle의 `SEQUENCE`와 `LPAD` 함수를 결합하여 구현했습니다.

<br>

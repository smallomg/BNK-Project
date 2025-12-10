# 안녕하십니까, 경험하며 성장 중인 개발자 이대영입니다.

> **"배운 것을 내 것으로 만들기 위해 끊임없이 노력합니다."**  
> 부족함은 열정으로 채우고, 모르는 것은 알 때까지 파고드는 끈기를 가지고 있습니다.  

<br>

## Tech Stack

### Backend & Framework
<img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white">

### Database
<img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

### Frontend & Mobile
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white"> <img src="https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white">

### Tools
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">

<br>

## Projects Timeline

<br>

### 1. BNK Financial Platform (Web & Mobile Integration)
> **소개:** BNK 금융 서비스를 벤치마킹하여 **웹 뱅킹 서비스(Phase 1)** 구축 후, 기능을 확장해 **모바일 앱 및 데이터 분석 시스템(Phase 2)**까지 개발한 연계 프로젝트  
> **개발 기간:** 2025.06 ~ 2025.08 (팀 프로젝트 / 5명)

금융 서비스의 **운영(Back-office)부터 데이터 분석(BI)까지 전반적인 관리자 사이클**을 전담하여 개발했습니다. 데이터 무결성을 위한 **승인 결재 시스템**과 사용자 행동 로그 기반의 **개인화 추천/분석 대시보드** 구축에 주력했습니다.

- **Tech Stack**: `Java`, `Spring Framework`, `OracleDB`, `MyBatis`, `JSP`, `Chart.js`, `Apache POI`
- **GitHub**: [소스코드 보러가기](https://github.com/smallomg/Portfolio/tree/main/BNK-Project)

**[My Key Contributions]**

**Phase 1. 웹 뱅킹 관리자 (운영 및 보안)**
*   **상품 승인 결재(Maker-Checker) 프로세스**
    *   금융 상품 등록/수정 시 즉시 서비스에 반영되지 않고, **임시 테이블(Temp)**에 저장 후 상위 관리자의 승인을 거쳐 **실 테이블(Real)**에 배포되는 로직을 설계하여 데이터 무결성을 확보했습니다.
*   **권한 기반 접근 제어 (RBAC)**
    *   `Interceptor`를 활용해 관리자 등급(Super/Sub Admin)을 구분하고, 등급에 따라 **승인 권한 부여 및 메뉴 접근을 엄격히 제어**하는 보안 로직을 적용했습니다.
*   **검색어 통계 및 관리**
    *   사용자 검색 로그를 수집하여 인기 검색어/금칙어를 관리하고, 검색 추이를 그래프(`Chart.js`)로 시각화하여 운영 편의성을 높였습니다.

**Phase 2. 모바일 앱 관리자 (데이터 분석)**
*   **사용자 행동 기반 추천 엔진 (Recommendation Logic)**
    *   사용자의 앱 내 행동(클릭, 페이지 체류, 발급 시도) 로그에 **가중치(Weight)**를 부여하는 알고리즘을 설계하여, **개인 맞춤형 인기 상품**을 자동 추천하도록 구현했습니다.
*   **비즈니스 인사이트 대시보드 (BI)**
    *   **상품 판매 추이** 및 **고객 이탈률(Churn Rate)** 데이터를 분석하여 시각화하고, 이탈 고객의 성별/연령대 등 인구통계학적 특성을 제공하여 마케팅 인사이트 도출을 지원했습니다.
*   **자동 리포팅 시스템 (Data Export)**
    *   화면에 조회된 통계 데이터를 실무자가 즉시 보고서로 활용할 수 있도록, `Apache POI` 라이브러리를 활용해 **Excel 및 PDF 파일로 자동 생성/다운로드**하는 기능을 구현했습니다.

<br>

### 2. BNK-miniproject (학원 미니 프로젝트)
> **소개:** Spring과 MyBatis를 활용한 **아쿠아리움 티켓 예약 및 관리 시스템**  
> **개발 기간:** 2025.05.21 ~ 2025.05.27 (1주)

메인 프로젝트 진행 전, **Spring Framework와 MyBatis**의 동작 원리를 익히고 MVC 패턴을 확실하게 이해하기 위해 진행한 프로젝트입니다.

- **Tech Stack**: `Java`, `Spring Framework`, `JSP`, `MyBatis`, `OracleDB`, `JavaScript`
- **GitHub**: [소스코드 보러가기](https://github.com/smallomg/Portfolio/tree/main/BNK-miniproject)

**[My Key Contributions]**

*   **게시판 기능 구현**
    *   QnA(1:1문의), FAQ, 공지사항의 CRUD 기능을 구현하고, 답글의 계층형 구조를 설계했습니다.
*   **동적 검색 시스템**
    *   MyBatis의 동적 쿼리(`<if>`, `<choose>`)를 활용하여 다중 조건(제목, 내용, 작성자 등) 검색 기능을 개발했습니다.
*   **협업 및 형상 관리**
    *   Git을 활용한 팀 프로젝트 협업을 통해 코드 병합(Merge) 및 충돌(Conflict) 해결 과정을 경험했습니다.

<br>

### 3. Portfolio-site (대학 졸업 작품)
> **소개:** 기획부터 디자인, 개발까지 전 과정을 경험한 **개인 포트폴리오 웹사이트**  
> **개발 기간:** 2024.03 ~ 2024.12

개발 공부를 본격적으로 시작하기 전, 대학 졸업 작품으로 진행한 프로젝트입니다. 하나의 서비스가 만들어지는 전체 사이클(Life-cycle)을 경험하는 데 중점을 두었습니다.

- **Tech Stack**: `Flutter`, `Dart`, `Firebase` *(실제 사용한 기술로 수정해주세요)*
- **GitHub**: [소스코드 보러가기](https://github.com/smallomg/Portfolio/tree/main/Portfolio-site)

**[My Key Contributions]**

*   **UI/UX 디자인 및 기획**
    *   전체적인 사이트 레이아웃 구성 및 사용자 경험을 고려한 화면 설계를 진행했습니다.
*   **프론트엔드 기능 구현**
    *   반응형 웹 디자인을 적용하여 다양한 디바이스 환경을 지원하도록 구현했습니다.

<br>


## Contact
- **Email**: dleodud558@gmail.com
- **GitHub**: [https://github.com/smallomg](https://github.com/smallomg)

<br>

---

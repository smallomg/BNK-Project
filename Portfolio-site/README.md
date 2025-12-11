# 🎓 Career Evaluation Platform (커리어 평가 플랫폼)

> **동명대학교 컴퓨터공학과 졸업작품**  
> **Development of Career Evaluation Platform**

## 📖 프로젝트 소개 (About Project)
본 프로젝트는 **취업 준비생들의 효율적인 취업 지원과 정보 공유를 돕기 위한 포트폴리오 웹 플랫폼**입니다.

기존 구직 플랫폼(사람인, 잡코리아 등)은 서류 제출에만 집중되어 있어 사용자 간의 소통이나 피드백 기능이 부족했습니다. 본 서비스는 이러한 문제를 해결하기 위해 **이력서/자기소개서 자동 생성** 기능과, 다른 구직자들과 서류를 공유하고 평가받을 수 있는 **피드백 커뮤니티** 기능을 통합하여 개발하였습니다.

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 (Technology) |
| :-- | :-- |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **Tools** | ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) |

---

## 📸 주요 기능 (Key Features)

### 1. 이력서 자동 생성 (Resume Auto-generation)
사용자가 프로필 정보를 입력하면, 직군에 적합한 레이아웃으로 이력서를 자동 변환하여 생성합니다.

| **이력서 정보 입력 (Input)** | **이력서 자동 생성 결과 (Output)** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/a61fecc2-0232-4e22-b3d4-2ab4a722522b" width="100%" /> | <img src="https://github.com/user-attachments/assets/4da5bc65-96a6-4fed-abb8-da9438f6a48e" width="100%" /> |
| *사용자 정보, 학력, 경력 사항 등 입력* | *입력된 정보를 바탕으로 PDF 포맷 자동 생성* |

<br>

### 2. AI 기반 자기소개서 생성 (AI Cover Letter)
지원하고자 하는 직무 키워드를 입력하면 AI 알고리즘이 자기소개서 초안을 작성해 줍니다.

| **AI 자기소개서 입력 (Input)** | **AI 자기소개서 생성 결과 (Output)** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/23c86ffc-40b0-493b-a5ce-ae5825d1c6df" width="100%" /> | <img src="https://github.com/user-attachments/assets/59d57bcb-69f9-4a78-b5fe-49a133fb39dd" width="100%" /> |
| *지원 직무 및 핵심 키워드 입력* | *AI가 작성한 자기소개서 초안 및 추천 문장* |

<br>

### 3. 포트폴리오 관리 및 목록 (Management)
작성한 이력서, 자기소개서, 포트폴리오를 업로드하고 통합 관리할 수 있습니다.

| **문서 업로드 (Upload)** | **업로드 목록 확인 (List View)** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/a9b699a6-f78e-4f76-9cac-bfe3e14afa30" width="100%" /> | <img src="https://github.com/user-attachments/assets/2edc861a-0142-480c-b7d9-756e825cf632" width="100%" /> |
| *파일 업로드 및 관리 페이지* | *업로드된 나의 문서 목록 확인* |

<br>

### 4. 사용자 피드백 시스템 (Feedback System)
> **Developed by Lee Daeyeong (이대영)**

본 프로젝트의 핵심 기능으로, 작성한 문서를 타인에게 공유하여 객관적인 평가를 받을 수 있습니다.

| **평가 점수 및 코멘트 입력** | **피드백 완료 목록** |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/d911e504-85ad-4603-a29c-0c915de7be4d" width="100%" /> | <img src="https://github.com/user-attachments/assets/da821456-216f-40a6-ba0f-afe1a92f0dfc" width="100%" /> |
| *항목별 점수 평가 및 코멘트 작성* | *다른 사용자들에게 받은 피드백 결과 확인* |

---

## 🏗 시스템 설계 (System Design)

### 시스템 아키텍처 (System Architecture)
<img src="https://github.com/user-attachments/assets/d93bc15f-f9fb-4033-a292-e514d2331a40" width="100%" />

### 서비스 흐름도 (Flowchart)
<img src="https://github.com/user-attachments/assets/6b9b3add-074a-4ea6-946b-3edd835968ae" width="100%" />

---

## 👨‍💻 팀원 소개 (Team Members)

| 이름 | 담당 역할 | 이메일 |
| :--: | :-- | :-- |
| **이대영** | **피드백 시스템 개발 (평가 로직, UI/UX)** | ldy4081@naver.com |
| **오윤호** | 이력서/포트폴리오 기능 개발, DB 설계 | dhdbsgh09@naver.com |
| **송찬혁** | AI 자기소개서 생성 기능, 프론트엔드 구조 | sbc3785@gmail.com |

**지도교수:** 김정인 교수님

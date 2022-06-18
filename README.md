# 🌈오늘날씨어때? How is the weather today?⛅

<h3>체질별, 위치별, 온도별로 알맞는 옷차림을 공유하는 웹사이트</h3>

> 2022-1 성신여대 서버시스템구축실습 팀프로젝트

</br>

|종류|내용|
|------|---|
|플랫폼|Node.js|
|DB|MySQL|
|웹서버|Google Cloud Platform(GCP)|

***
<h1>Manual</h1>

<h2>Requirements</h2>
1️⃣ Git Clone </br>

```
$ git clone https://github.com/Suanna01/HowIsTheWeatherToday2.git
```

2️⃣ HowIsTheWeatherToday2 프로젝트로 폴더 이동

```
$ cd HowIsTheWeatherToday2/
```
3️⃣ HowIsTheWeatherToday2 폴더 바로 아래에 별도로 제공되는 .env 파일이 있어야한다. 민감한 내용이 담겨있어 별도로 따로 제공한다. </br> 
![image](https://user-images.githubusercontent.com/86403488/174435785-643687a7-8d45-4c27-afed-0adf8b5f3378.png)


<h2>Installation </h2>

```
$ npm install
$ npm install dotenv
```

<h2>Execute</h2>
1️⃣ GCP를 시작/재개한다. 개인정보가 담겨있어 별도로 따로 제공한다.  </br>
2️⃣ 아래 실행 명령 입력

```
$ npm start
```

***

<h2>Demo video</h2>

### https://youtu.be/97H-E_Uxthw

</br>

<h2>주요 기능</h2>

### 🔐 회원가입
- 실행 화면</br>
- 기능 
  - 비밀번호 확인이 통과돼야 회원가입이 가능하다.
  - 이미 존재하는 이메일 계정이면 회원가입이 불가능하다.</br>
![image](https://user-images.githubusercontent.com/86403488/173875303-2d65d8c8-4f9b-49b4-ba66-b280987f0b9a.png)

### 🔐 기본 로그인
- 실행 화면</br>
- 기능 
  - 회원 DB에 존재하는 계정이어야만 로그인이 가능하다.</br>
![image](https://user-images.githubusercontent.com/86403488/173873537-57b2379a-610d-4121-adaa-e359d708c264.png)

### 💛 카카오 로그인
- 실행 화면</br>
![제목 없음](https://user-images.githubusercontent.com/86403488/173873947-a90e00b5-6e20-4033-958f-aac7eb20326e.png)

### ✍️ 게시글 작성
- 실행 화면</br>
- 기능 
  - 이미지를 업로드할 수 있다.
  - 해시태그 작성</br>
![2](https://user-images.githubusercontent.com/86403488/173874155-53e4da6b-8cb0-41e0-841c-82d65444eb5c.png)

### 👩 마이페이지
- 실행 화면</br>
- 기능 
  - 자신이 올린 게시물만 확인할 수 있다.</br>
![image](https://user-images.githubusercontent.com/86403488/173876642-f7efb26a-e63c-4183-8959-c47f335d5046.png)

### 💌 댓글
- 실행 화면
- 기능 
  - 자신이 올린 댓글만 삭제할 수 있다.</br>
![image](https://user-images.githubusercontent.com/86403488/173874961-1fd95798-fd0a-4eeb-b015-68e54b68eb30.png)

### 🪕 해시태그 
- 실행 화면
- 기능 
  - 체질별, 온도별, 위치별, 날짜별 해시태그로 검색이 가능하다</br>
![image](https://user-images.githubusercontent.com/86403488/173875640-7c34134c-d1ef-48bb-a2f6-e67b9efbf744.png)
![image](https://user-images.githubusercontent.com/86403488/173876254-3eee6e84-1625-4a13-85c5-354d206ea882.png)

### ☂️ 날씨 검색 
- 실행 화면</br>
- 기능 
  - 지역별로 날씨를 확인할 수 있다.
  - 실시간 날씨를 확인할 수 있다.
  - 검색한 날씨에 맞는 옷을 입은 사람들의 게시물을 확인할 수 있다.</br>
![image](https://user-images.githubusercontent.com/86403488/173876735-cc1434e1-561f-4265-947a-db414f0c7084.png)

### 👩‍👩‍👧 팔로우-팔로잉
- 실행 화면</br>
- 기능 
  - 팔로우, 팔로잉 목록을 확인할 수 있다.
  - 팔로우 취소를 할 수 있다.
  - 자신은 팔로우할 수 없다.</br>
![image](https://user-images.githubusercontent.com/86403488/173876859-aa9a0899-2727-400c-8aeb-d1b573249e9c.png)
![image](https://user-images.githubusercontent.com/86403488/173876927-f405626c-af81-4cd1-9313-b2fa71b2f4a4.png)
![image](https://user-images.githubusercontent.com/86403488/173877226-4ffc2051-392b-4d6a-8911-b9a2d807a8a3.png)

### 🔨 닉네임 수정
- 실행 화면</br>
- 기능 
  - 수정 시, 자신이 올린 게시물, 댓글의 이름이 모두 변경된다.</br>
![image](https://user-images.githubusercontent.com/86403488/173877285-a6ea3b77-70ee-4e89-ab23-e67f8e8c5518.png)

### ✂️ 게시글, 댓글 삭제
- 실행 화면</br>
- 기능 
  - 자신이 올린 게시글, 댓글만 삭제할 수 있다.</br>
![image](https://user-images.githubusercontent.com/86403488/173877498-ae6c3730-e9fc-48ce-9fed-2a475a9b5557.png)
![image](https://user-images.githubusercontent.com/86403488/173877560-132069c1-b986-47e6-8c53-a4393efe2523.png)

### 👋 로그아웃
- 실행 화면</br>
![image](https://user-images.githubusercontent.com/86403488/173877673-3c3a31b2-b9d3-4ef8-a73e-2d35ebf6cc25.png)

### 🙅 회원탈퇴
- 실행 화면</br>
![image](https://user-images.githubusercontent.com/86403488/173877838-3c6768d6-d992-46e0-b137-4231d68e0c87.png)

***

![image](https://user-images.githubusercontent.com/86403488/173384508-909ccbaf-9aa6-4bb7-80cb-55745dfb1b0e.png)
![image](https://user-images.githubusercontent.com/86403488/173384544-79fa1594-0eb3-4aa1-978b-e5e3477e512b.png)
![image](https://user-images.githubusercontent.com/86403488/173384578-1bda9b97-b14c-4844-8c29-e2f59bbd47f9.png)

# 1) 베이스 이미지로 Node 18 LTS 사용
FROM node:18

# 2) 작업 디렉터리 설정
WORKDIR /workspace

# 3) 의존성 설치를 위한 사전 복사 
#    - server, client 각각의 package*.json 만 먼저 복사해 두면
#      코드 변경 시 매번 npm install을 다시 안 하게 돼서 빌드가 빨라집니다.
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# 4) 서버/클라이언트 의존성 설치
RUN cd server && npm install
RUN cd client && npm install

# 5) 나머지 코드 전체 복사
COPY . .

# 6) 기본 명령은 쉘 열기
CMD [ "bash" ]

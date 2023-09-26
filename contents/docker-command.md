---
date: '2023-09-26'
title: '도커 실전 명령어 모음'
categories: ['Docker','DevOps','Tip']
summary: ''
thumbnail: './docker/docker.png'
---

## 도커 실전 명령어 정리

필자가 자주쓰는 명령어들을 정리해보았습니다.  
조금더 자세한 정보를 원하면 Source 의 블로그를 참조하세요!

```bash
docker ps -a                              // 컨테이너 목록 확인
docker inspect <id or name>               // 컨테이너 정보
docker logs <id or name>                  // 컨테이너 로그
docker exec -it <id or name> bash         // 컨테이너 접속
docker images                             // 이미지 목록 확인

docker run <옵션> <이미지:태그> <명령어>     // pull + create + start 종합

-it                                       // 사용자 키보드 입력과 터미널 접근 가능
--name mycontainer                        // 이름 설정
--rm                                      // 컨테이너가 꺼지면 삭제
-p 80:8080                                // 호스트 80에 들어오는 연결을 컨테이너의 8080에 연결
-d                                        // 백그라운드 실행
-w /tmp                                   // 작업영역을 /tmp로 변경.
-v $(pwd):/data                           // 호스트의 디렉토리를 컨테이너의 data에 마운트

docker start <id or name>                 // 컨테이너 실행
docker stop <id or name>                  // 컨테이너 정지
docker rm <id or name>                    // 컨테이너 제거
docker rmi <img id>                       // 이미지 제거

docker build -t <이름> <dockerfile 경로>   // 컨테이너 생성
```

## Source

- [https://ktae23.tistory.com/201](https://ktae23.tistory.com/201)
- [https://www.lainyzine.com/ko/article/docker-run/](https://www.lainyzine.com/ko/article/docker-run/)
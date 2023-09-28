---
date: '2023-09-28'
title: 'docker start 컨테이너 즉시 종료 상황'
categories: ['Docker','DevOps','Tip']
summary: 'docker start후 컨테이너가 바로 종료되는 상황의 원인과 해결책을 알아봅니다.'
thumbnail: './docker/docker.png'
---

## 1. 미리 보는 결론

포그라운드 컨테이너는 `docker run -i` 혹은 `docker run -t` 명령어를 사용해서 만들자.   
`-i`나 `-t` 옵션이 없는 상태로 만들어지면 추후 `docker start`해도 바로 종료된다(도커는 기본적으로 지정된 명령어만 실행하고 종료). 아니면, 추후 컨테이너의 `json` 설정 파일을 변경해야 한다.  

## 2. 문제 인식

`docker run ubuntu:22.04` 으로 컨테이너를 만들면, 컨테이너를 다시 켜도 항상 바로 종료됩니다.  
이는 기본적으로 도커가 설정된 명령어만 수행하고 바로 종료되기 때문입니다.  
\
그러나 `docker run -it ubuntu:22.04` 경우에는 컨테이너를 다시 켜도 바로 종료되지 않습니다.  
`-it`가 정확히 어떤 차이점을 만들길래 바로 종료되지 않고 기다리는지 궁금증이 생겼습니다.  

## 3. 설명
우선 옵션의 가능한 모든 경우를 테스트해 보았습니다.
```bash
docker run --name test ubuntu:22.04
// 바로 꺼짐
docker start test
// 바로 꺼짐
docker start -i test
// 바로 꺼짐

docker run -i --name test ubuntu:22.04
// 바로 꺼지지 않음, 그러나 프롬프트 접근 불가
docker stop test
docker start test
// 바로 꺼지지 않음
docker exec -it test bash
// 프롬프트 접근 가능

docker run -t --name test ubuntu:22.04
// 바로 꺼지지 않음, 프롬프트 접근 가능. but 키보드 입력불가
docker start test
// 바로 꺼지지 않음
docker exec -it test bash
// 프롬프트 접근 가능

docker run -it --name test ubuntu:22.04 
// 바로 꺼지지 않음, 프롬프트 접근 가능
docker stop test
docker start test
// 바로 꺼지지 않음
docker exec -it test bash
// 프롬프트 접근 가능
```

위의 경우를 보면 알 수 있듯이, `-i`나 `-t` 옵션을 주지 않고 `docker run`을 할 경우, 추후 아무리 다시 `docker start` 를 해도 컨테이너가 바로 종료됩니다.  
좀 더 자세히 알아보기 위해 각 컨테이너의 `inspect` 설정 파일을 열어봅니다.  

```
// no option
"AttachStdin": false,
"AttachStdout": true,
"AttachStderr": true,
"Tty": false,
"OpenStdin": false,
"StdinOnce": false,
```
```
// with -it option
"AttachStdin": true,
"AttachStdout": true,
"AttachStderr": true,
"Tty": true,
"OpenStdin": true,
"StdinOnce": true,
```
위의 두 파일을 보면 알 수 있듯이 `-it` 옵션을 사용하지 않을 경우, 표준 입출력 및 tty 옵션 자체가 전부 false로 고정됩니다. 정확하지는 않지만, 이 두 옵션이 전부 꺼져있으면 추후 `docker start` 를 해도 사용자를 기다리지 않고 바로 종료되는 것 같습니다.  
따라서, 추후 도커에 다시 `docker exec -it` 등으로 접근하기 위해서는 처음부터 `docker run -it` 옵션이 필요한 것으로 예상됩니다. 😫

---
date: '2023-10-04'
title: 'dockerfile nvm 설치 에러 해결법 source: not found, nvm: command not found'
categories: ['Docker','DevOps', 'Back-end']
summary: 'dockerfile에 nvm을 설치하다 겪는 다양한 오류를 해결합니다. '
thumbnail: './docker/docker.png'
---

## 1. 미리 보는 결론 👀

다음과 같이 dockerfile을 구성하면 된다.
```dockerfile
FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]
RUN source ~/.nvm/nvm.sh && nvm install 16.16.0 && npm install -g yarn
```

## 2. 문제 인식

기술 블로그로 사용하고 있는 현 Gatsby 블로그를 기존 windows 환경에서 docker로 이전하려고 했습니다.
운영체제를 포맷하거나 바꿔도 블로그는 여전히 작성해야하고, 그때마다 환경을 바꾸면 힘들기 때문이죠. ~미리하는 개고생 😭~

## 3. 설명

우선, `dockerfile`을 작성하기 전에 직접 `ubuntu:22.04` 컨테이너를 기반으로 하나씩 패키지를 설치하며 테스트를 마쳤습니다.  
그리고, 위에서 사용했던 명령어를 바탕으로 다음같이 첫번째 `dockerfile`을 만들었습니다.

```dockerfile
//version 1
FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \
	source ~/.bashrc

RUN nvm install 16.16.0 && \
	npm install -g yarn
```
하지만 돌아온 것은 다음같은 에러.
```
(생략)
1.140 /bin/sh: 1: source: not found
------
dockerfile:8
--------------------
   7 |     
   8 | >>> RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \
   9 | >>>      source ~/.bashrc
  10 |     
--------------------
ERROR: failed to solve: process "/bin/sh -c curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \tsource ~/.bashrc" did not complete successfully: exit code: 127
```

에러의 요지는 다음과 같습니다. `/bin/sh: 1: source: not found`, `source` 라는 명령어를 못찾겠다. 분명 실제 `ubuntu:22.04` 컨테이너에서 사용했을때는 문제가 없었는데 왜일까요?  
\
답은 stackoverflow에서 찾았습니다. [Using the RUN instruction in a Dockerfile with 'source' does not work](https://stackoverflow.com/questions/20635472/using-the-run-instruction-in-a-dockerfile-with-source-does-not-work). 답변을 정리하면, `bash(Bourne Again Shell)`와 `sh(Bourne shell)`, 정확히는 ubuntu의 `dash`의 차이 때문입니다.
`bash`에는 `source`가 있고, `dash`에는 `source`가 없기 때문에 문제가 생깁니다.  
\
평소 사용하던 ubuntu login shell은 `bash` 입니다. ps를 치면 다음과 같이 나오죠.  
```
root@ff529b1771e7:~# ps
  PID TTY          TIME CMD
10714 pts/1    00:00:00 bash
10905 pts/1    00:00:00 ps
```
하지만 ubuntu system shell 에서 사용하는 것은 `dash`입니다. 즉, `dockerfile` 에서는 `dash`가 사용되기에 `source ~/.bashrc` 에서 오류가 발생합니다.  
\
해결책은 간단합니다. `SHELL ["/bin/bash", "-c"]`을 넣어서 실행하는 셸을 `bash`로 바꿉니다.  
```dockerfile
//version 2
FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]

RUN source ~/.bashrc

RUN nvm install 16.16.0 && \
	npm install -g yarn
```
근데 또 다른 에러가 발생합니다.
```
0.493 /bin/bash: line 1: nvm: command not found
------
dockerfile:14
--------------------
  13 |
  14 | >>> RUN nvm install 16.16.0 && \
  15 | >>>      npm install -g yarn
--------------------
ERROR: failed to solve: process "/bin/bash -c nvm install 16.16.0 && \tnpm install -g yarn" did not complete successfully: exit code: 127
```
에러의 요지는 다음과 같습니다. `nvm: command not found`, `nvm`이라는 명령어를 못찾겠다.  
이번에는 원인이 어느정도 바로 보입니다. 환경변수 등록 및 `source ~/.bashrc` 에 문제가 있었던거겠죠. 하지만, 왜 로그인 셸에서는 잘 작동한 `source ~/.bashrc`가 작동하지 않는지는 의문입니다.  
인터넷을 좀 뒤져가며 테스트해보니 `source ~/.nvm/nvm.sh`가 잘 작동합니다. 저도 `nvm`의 구조는 잘 모르는 지라 추후 왜 이런지 확인은 필요할듯 싶습니다.  
이렇게 변경한 `dockerfile`은 다음과 같습니다.  
```dockerfile
//version 3
FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]

RUN source ~/.nvm/nvm.sh

RUN nvm install 16.16.0 && \
	npm install -g yarn
```
하지만 여전히 오류가 납니다....
```
0.401 /bin/bash: line 1: nvm: command not found
```
한참을 찾은결과, 답은 여기에 있었습니다. [activating nvm during docker build](https://github.com/nvm-sh/nvm/issues/920).
사이트에서 스크롤을 내리다 보면 다음과 같은 표현이 있습니다.  

> It turned out to be a docker peculiarity (or my misunderstand of it). Apparently the RUN commands don't carry over from line to line and you can't activate nvm in one line and then use it in the next. Chaining the calls in one RUN with && solves the problem so not an nvm issue at all. 

즉, docker에서 `RUN`은 라인별로 새롭게 작동하기 때문에 기껏 `source ~/.nvm/nvm.sh`를 해도 전달이 안된 것 같습니다. 따라서 `&&`로 명령어를 이어줍니다.  
이를 바탕으로 최종 dockerfile을 만들면 다음과 같습니다.  
```dockerfile
//version 4
FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]
RUN source ~/.nvm/nvm.sh && nvm install 16.16.0 && npm install -g yarn
```
```
[+] Building 8.3s (8/8) FINISHED                                                  docker:default 
 => [internal] load .dockerignore                                                           0.0s 
 => => transferring context: 2B                                                             0.0s 
 => [internal] load build definition from dockerfile                                        0.0s 
 => => transferring dockerfile: 317B                                                        0.0s 
 => [internal] load metadata for docker.io/library/ubuntu:22.04                             0.0s 
 => [1/4] FROM docker.io/library/ubuntu:22.04                                               0.0s 
 => CACHED [2/4] RUN apt update -y &&     apt upgrade -y &&     apt install -y     curl     0.0s 
 => CACHED [3/4] RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install  0.0s 
 => [4/4] RUN source ~/.nvm/nvm.sh && nvm install 16.16.0 && npm install -g yarn            7.8s 
 => exporting to image                                                                      0.5s 
 => => exporting layers                                                                     0.5s 
 => => writing image sha256:79e8a3152b155fcc4b231180a19f5de15c7f29f86592a973f4a939ef5d627e  0.0s
 => => naming to docker.io/library/posttest
```
드디어 작동하네요 😎

## Source

- Using the RUN instruction in a Dockerfile with 'source' does not work
  [https://stackoverflow.com/questions/20635472/using-the-run-instruction-in-a-dockerfile-with-source-does-not-work](https://stackoverflow.com/questions/20635472/using-the-run-instruction-in-a-dockerfile-with-source-does-not-work)

- activating nvm during docker build
  [https://github.com/nvm-sh/nvm/issues/920](https://github.com/nvm-sh/nvm/issues/920)
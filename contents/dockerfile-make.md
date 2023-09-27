---
date: '2023-09-27'
title: 'FastAPI와 Jdk-17이 설치된 Dockerfile을 만들어보자'
categories: ['Docker','DevOps']
summary: '예시를 통해 원하는 환경의 Dockerfile을 만들어 봅니다.'
thumbnail: './docker/docker.png'
---

## 1. 목표 환경

이번에 학교 [팀 프로젝트](https://github.com/skkuse/2023fall_41class_team2)를 진행하면서 FastAPI와 Jdk가 설치된 컨테이너가 필요해졌습니다. 해당 팀 프로젝트의 주제와 자세한 구현은 추후 다른 포스트에서 다시 다룰 예정입니다. 😏
dockerfile을 어떻게 구성하면 되는지 한줄씩 살펴보도록 하겠습니다.

```dockerfile
FROM ubuntu:22.04

# Install basic
RUN apt-get update -y && \ 
    apt-get install -y \
    software-properties-common \
    git \
    time
# Install Python 3.10
RUN add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update -y && \
    apt-get install -y python3.10 python3-pip
# Install pipenv
RUN pip install pipenv
# Install JDK 17
RUN apt-get install openjdk-17-jdk -y
# Test version
RUN java -version && python3 --version
CMD ["bash"]
```

1. `FROM ubuntu:22.04` 기본 이미지를 우분투로 설정합니다.
2. `apt-get update -y` apt 목록을 업데이트 합니다.
3. `apt-get install -y software-properties-common git time` 개발환경에 있어 필요한 기초 패키지들을 설치합니다. time의 경우, java 런타임 리소스 사용량 측정에 필요합니다.
4. `add-apt-repository ppa:deadsnakes/ppa -y` Python 3.10 패키지를 가져올 repo를 등록합니다. 기본 apt에는 없기 때문입니다.
5. `apt-get update` 새로운 repo를 위해 업데이트를 해줍니다.
6. `apt-get install -y python3.10 python3-pip` python3.10와 pip 을 설치합니다.
7. `pip install pipenv` python 환경관리 패키지를 설치합니다.
8. `apt-get install openjdk-17-jdk -y` jdk 17을 설치합니다.
9. `java -version && python3 --version` 설치후 간단히 버전을 확인합니다.
10. `CMD ["bash"]` 해당 컨테이너 실행시, bash가 동작하도록 합니다.

## 2. build test

만들어진 dockerfile을 `docker build -t`로 테스트해서 정상적으로 만들어지면 완성입니다!

```bash
C:\Users\hyeondong\Desktop\dockerfile_test\swe2023>docker build -t dev_test .
[+] Building 81.4s (5/9)                                                              docker:default
 => [internal] load build definition from Dockerfile                                            0.0s
 => => transferring dockerfile: 496B                                                            0.0s
 => [internal] load .dockerignore                                                               0.0s
 => => transferring context: 2B                                                                 0.0s
 => [internal] load metadata for docker.io/library/ubuntu:22.04                                 0.0s
[+] Building 388.2s (10/10) FINISHED                                             docker:default
 => [internal] load build definition from Dockerfile                                       0.0s
 => => transferring dockerfile: 496B                                                       0.0s
 => [internal] load .dockerignore                                                          0.0s
 => => transferring context: 2B                                                            0.0s8 => [internal] load metadata for docker.io/library/ubuntu:22.04                            0.0s
 => [1/6] FROM docker.io/library/ubuntu:22.04                                              0.0s. => CACHED [2/6] RUN apt-get update -y &&     apt-get install -y     software-properties-  0.0s
 => [3/6] RUN add-apt-repository ppa:deadsnakes/ppa -y &&     apt-get update -y &&       230.1s
 => [4/6] RUN pip install pipenv                                                           2.7s
 => [5/6] RUN apt-get install openjdk-17-jdk -y                                          153.1s
 => [6/6] RUN java -version && python3 --version                                           0.5s
 => exporting to image                                                                     1.8s
 => => exporting layers                                                                    1.8s
 => => writing image sha256:b0fab18a8b37fb9020a98ea3b79e19580162aef3fac4623dfe8ad74e3f88b  0.0s
 => => naming to docker.io/library/dev_test                                                0.0s

What's Next?
  View a summary of image vulnerabilities and recommendations → docker scout quickview
```
잘 작동하네요 🥂

## Source

- /usr/bin/time: No such file or directory  
  [https://stackoverflow.com/questions/20278064/usr-bin-time-no-such-file-or-directory](https://stackoverflow.com/questions/20278064/usr-bin-time-no-such-file-or-directory)

- Dockerfile 개념 및 작성법  
  [https://wooono.tistory.com/123](https://wooono.tistory.com/123)

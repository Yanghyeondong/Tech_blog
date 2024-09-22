---
date: '2024-03-09'
title: 'K8S와 K3S의 차이점'
categories: ['K8s', 'Docker','DevOps', 'Choice']
summary: 'k8s와 k3s의 차이점을 알아봅니다'
thumbnail: './k8s/k3s.jpg'
---

## 미리보는 결론

k3s는
- k8s 경량화 버전
- 설치, 배포 및 관리가 쉽고 빠르다 
- 메모리 사용량이 더 적다
- 싱글노드 클러스터를 지원한다
\
하지만,  
- 기본 분산 데이터베이스 시스템을 제공하지 않는다
- k8s 알파버전 기능들이 제거되었다
- 빅데이터 분석과 같은 작업에는 적합하지 않다



### K3S란?

k8s의 경량화 버전으로, 설치, 배포 및 관리가 쉽고 빠르다.   
k8s 메모리의 절반을 목표, 따라서 k8s(10글자) -> k3s(5글자).  
k8s의 인증된 공식 배포판이며, K8s와 동일한 소스 코드를 기반으로 한다. (단순히 fork된 프로젝트가 아니다. 지속적인 업스트림 k8s 코어 유지)  
Rancher Labs(랜처 랩)에서 개발 및 관리한다.


### K3S 특징
1. 가벼움  
   적은 램 환경에서도 사용할 수 있게, 기존 k8s에서 단일 바이너리 파일이 100MB가 넘어 가는걸 분리했다. 
   기존 k8s에서 alpha 버전에 해당하는 기능이나 레거시 컴포넌트, 써드파티 storage drivers, cloud provider 등을 제거했다.
2. 학습 곡선이 완만  
   쉽게 배우고 적용할 수 있다
3. 빠른 설치 및 배포  
   CRI, ingress controller, CoreDNS 등을 전부 포함하고 있다.
4. 싱글 노드 클러스터를 지원한다.

### K3S 단점

기본적으로 분산 데이터베이스를 지원하지 않는다.
대량의 빅데이터를 다루거나 매우 높은 성능이 요구되는 대규모 서버의 경우 K8S를 사용하는 것이 안정성 측면에서 더 좋다.

#### 분산 데이터베이스란? 
하나의 DBMS 시스템이 여러 컴퓨터(네트워크로 연결된)에 연결된 저장장치들을 제어하는 것.

#### 가용성이란? 
시스템이 정상적으로 사용 가능한 정도. 이를 위해서는 장애가 발생하더라도 빠르게 대처 및 복구하여 고객 입장에서 영향을 최대한 느끼지 못하도록 해야한다.  

### 왜 K3S를 사용하는가?
더 적은 리소스로 더 빠르게 운영을 하면서도 고가용성, 확장성, 보안등을 가진 k8s 아키텍처의 이점을 가져온다.
추가 클라우드 공급자 확장 없이 k8s를 온프레미스로 구축할 수 있는 좋은 방법이다.

### K3S 구조
![0](./k8s/k3s_ar.jpg)
k3s는 서버 노드와 에이전트 노드로 나뉜다. 서버 노드는 k3s server command를 실행시키며 control-plane과 datastore component을 관리하는 노드이며, 에이전트 노드는 k3s agent command를 실행시키며 control-plane과 datastore component가 없는 노드이다. 두 노드 모두 kubelet, 컨테이너 런타임(container-d), CNI를 실행한다.


## DEV-ROOM 프로젝트에서 K3S를 사용한 이유

추후, 다른 학교나 단체에서 이를 쉽게 활용하기 위해서는 온프레미스 서버등에 쉽게 설치 및 관리할 수 있어야 한다. 따라서 설치, 배포, 관리가 편리한 k3s가 좋다.  
k3s의 주요 단점중 분산 데이터베이스의 부재가 있지만, 본 프로젝트 에서는 학생과 교수 정보를 별도의 클라우드에서 DB로 관리하므로 문제의 여지가 없다.  
사용자 경험 측면에서 높은 컴퓨팅 리소스를 제공하는 것이 해당 프로젝트의 우선 순위이므로, k3s를 사용하여 자체 리소스 사용량을 최대한 절약하는게 좋다.  

## Source

- K3s Vs K8s: What's The Difference? 2024 UPDATE - CloudZero  
  [https://www.cloudzero.com/blog/k3s-vs-k8s/#:~:text=The%20most%20significant%20difference%20between,for%20installing%20and%20running%20Kubernetes.](https://www.cloudzero.com/blog/k3s-vs-k8s/#:~:text=The%20most%20significant%20difference%20between,for%20installing%20and%20running%20Kubernetes.)
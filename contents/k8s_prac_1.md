---
date: '2024-01-11'
title: '『쿠버네티스 교과서』실습 1장'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## k8s 개념 간단 정리

### k8s  
컨테이너를 실행 및 관리(오케스트레이션)하는 플랫폼  
애플리케이션 시작, 롤링 업데이트, 서비스 수준유지, 스케일링 등 기능 제공.  

### k8s의 핵심
1. API - 애플리케이션 정의
2. 클러스터 - 애플리케이션 실행

### 클러스터란?
컨테이너 런타임이 동작하는 여러 대의 서버(Node)로 구성된 하나의 논리적 단위.  
k8s 클러스터에서는 각각의 노드를 신경 쓸 필요가 없다. 클러스터가 알아서 관리!

### 노드란?
컨테이너 런타임을 실행하는 서버.  
노드중 일부는 k8s API를 실행하고 나머지는 컨테이너 속에서 동작하는 애플리케이션을 실행한다.  

### 배포 과정
- 명령행 도구 등으로 원격에서 k8s API를 통해 애플리케이션 관리
- YAML 파일로 애플리케이션의 구성을 기술
- YAML이 클러스터에 전달되면 애플리케이션 배포
- 추후 상황에 따라 노드의 대체나 컨테이너 재시작, 스케일링 등을 추가로 실행 
따라서 모든 클러스터에서 동일하게 동작하는 자기수복형 애플리케이션 구동이 가능하다.

### k8s 기타 지원 기능
- 분산 데이터베이스  
  애플리케이션 구성 정보, API 키, 패스워드등 저장 가능
- 스토리지  
  컨테이너 외부에 데이터 저장 가능. 고가용성 확보. 노드의 디스크나 공유 스토리지에 저장
- 트래픽 관리  

### 실습 환경

- Kubernetes v1.28. Docker Desktop

```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get nodes
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   16h   v1.28.2
PS C:\Users\hdyang\Desktop\Project\k8s-practice>   
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
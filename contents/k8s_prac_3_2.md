---
date: '2024-01-18'
title: '『쿠버네티스 교과서』실습 3장 part 2'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 클러스터 외부 트래픽
데이터베이스와 같은 스토리지 컴포넌트는 k8s 외부에서 동작할수도 있다.  
클러스터 외부를 가리키는 도메인 네임을 통해 이를 해결한다.  

### 익스터널네임
애플리케이션 파드에서 로켈 네임을 사용하고, k8s DNS서버에 이 로컬 네임을 조외하여 외부 도메인으로 해소해준다.  
단, HTTP 서비스의 경우 헤더의 호스트명이 익스터널네임 서비스와 다르다면 오류가 발생한다.  

### 헤드리스 서비스
클러스터 IP 형태로 정의가 되지만, 레이블 셀렉터가 없어 대응하는 파드도 없다. IP 주소의 목록이 담긴 엔드포인트와 함께 배포된다.  

### 엔드포인트
모바일 디바이스, 데스크톱 컴퓨터, 가상 머신, 임베디드 디바이스, 서버 등 네트워크 시스템에 연결하는 물리적 디바이스. 단, k8s에서는 서비스가 트래픽을 전달하고자 하는 Pod의 집합. 즉, 각 pod로 트래픽을 연결해주는 k8s 서비스의 일부분.  

- 서비스에도 컨트롤러가 존재하여, 파드가 변경되면 엔드포인트의 목록을 최신으로 업데이트한다!

### k8s 네트워크 프록시
파드에서 나온 통신의 라우팅을 담당한다. 각각의 노드에서 모든 서비스의 엔드포인트에 대한 최신 정보를 유지하고, 운영체제가 제공하는 네트워크 패킷 필터를 사용하여 트래픽을 라우팅한다.  

- 파드는 각 노드마다 네트워크 프록시를 경유하여 네트워크에 접근한다.  
- 프록시는 패킷 필터링을 적용하여 가상 IP 주소를 실제 엔드포인트로 연결한다.  

### 네임스페이스
여러 k8s 리소스를 하나로 묶기 위한 리소스. k8s 클러스터를 논리적 파티션으로 나누는 역할.
기본적으로 default 네임스페이스가 있고, DNS 서버나 API 같은 내장 컴포넌트가 쓰는 kube-system 네임스페이스가 있다.

## 실습

### 주요 요점들
- 서비스는 k8s 가상네트워크의 일부로, 모든 파드가 제한없이 접근할 수 있다.
- 각 파드에서는 도메인 네임을 조회하여 k8s DNS를 거쳐 서비스의 도메인 네임과 IP를 확인할 수 있다. 
- 로컬 도메인 네임은 네임스페이스를 포함하는 완전한 도메인 네임의 별명이다. 

### 매니페스트 파일
api-service-externalName.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: numbers-api
spec:
  type: ExternalName
  externalName: raw.githubusercontent.com
```

### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 현재 배포된 클러스터IP 서비스를 삭제한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl delete svc numbers-api
service "numbers-api" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 익스터널네임 서비스를 새로 배포한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f numbers-services/api-service-externalName.yaml
service/numbers-api created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 서비스의 상세 정보를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc numbers-api
NAME          TYPE           CLUSTER-IP   EXTERNAL-IP                 PORT(S)   AGE
numbers-api   ExternalName   <none>       raw.githubusercontent.com   <none>    2s

PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl exec deploy/numbers-api -- sh -c 'nslookup numbers-api'            
Server:         10.96.0.10
Address:        10.96.0.10:53

server cant find numbers-api.cluster.local: NXDOMAIN

server cant find numbers-api.cluster.local: NXDOMAIN

server cant find numbers-api.svc.cluster.local: NXDOMAIN

server cant find numbers-api.svc.cluster.local: NXDOMAIN

numbers-api.default.svc.cluster.local   canonical name = raw.githubusercontent.com
Name:   raw.githubusercontent.com
Address: 185.199.108.133
Name:   raw.githubusercontent.com
Address: 185.199.111.133
Name:   raw.githubusercontent.com
Address: 185.199.109.133
Name:   raw.githubusercontent.com
Address: 185.199.110.133

numbers-api.default.svc.cluster.local   canonical name = raw.githubusercontent.com
Name:   raw.githubusercontent.com
Address: 2606:50c0:8001::154
Name:   raw.githubusercontent.com
Address: 2606:50c0:8003::154
Name:   raw.githubusercontent.com
Address: 2606:50c0:8000::154
Name:   raw.githubusercontent.com
Address: 2606:50c0:8002::154
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 헤드리스 서비스를 배포한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f numbers-services/api-service-headless.yaml
service/numbers-api created
endpoints/numbers-api created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 서비스의 상세 정보를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc numbers-api
NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
numbers-api   ClusterIP   10.106.142.227   <none>        80/TCP    0s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 엔드포인트의 상세 정보를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get endpoints numbers-api
NAME          ENDPOINTS            AGE
numbers-api   192.168.123.234:80   0s
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # sleep-2 서비스의 엔드포인트 목록 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get endpoints sleep-2
NAME      ENDPOINTS       AGE
sleep-2   10.1.0.102:80   59m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 파드 삭제
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl delete pods -l app=sleep-2
pod "sleep-2-7f69798f94-9mn2v" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 엔드포인트가 새로운 파드의 주소로 업데이트되었는지 확인 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get endpoints sleep-2
NAME      ENDPOINTS   AGE
sleep-2   <none>      59m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 디플로이먼트 채로 삭제
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl delete deploy sleep-2
deployment.apps "sleep-2" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 엔드포인트는 여전히 있지만, 가리키는 IP 주소가 없음     
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get endpoints sleep-2



NAME      ENDPOINTS   AGE
sleep-2   <none>      60m
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # default 네임스페이스의 서비스 리소스 목록 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc --namespace default
NAME          TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes    ClusterIP      10.96.0.1        <none>        443/TCP          4h53m
numbers-api   ClusterIP      10.106.142.227   <none>        80/TCP           4h46m
numbers-web   LoadBalancer   10.108.149.146   localhost     8080:31104/TCP   4h52m
sleep-2       ClusterIP      10.111.245.96    <none>        80/TCP           74m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 쿠버네티스 시스템 네임스페이스의 서비스 리소스 목록 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc -n kube-system
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   4h53m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 완전한 도메인 네임으로 DNS 조회하기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl exec deploy/sleep-1 -- sh -c 'nslookup numbers-api.default.svc.cluster.local | grep "^[^*]"'   
Server:       10.96.0.10
Address:      10.96.0.10:53
Name:   numbers-api.default.svc.cluster.local
Address: 10.106.142.227
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 쿠버네티스 시스템 네임스페이스의 완전한 도메인 네임으로 DNS 조회하기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl exec deploy/sleep-1 -- sh -c 'nslookup kube-dns.kube-system.svc.cluster.local | grep "^[^*]"'  
Server:       10.96.0.10
Address:      10.96.0.10:53
Name:   kube-dns.kube-system.svc.cluster.local
Address: 10.96.0.10
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
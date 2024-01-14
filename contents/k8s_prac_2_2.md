---
date: '2024-01-14'
title: '『쿠버네티스 교과서』실습 2장 part 2'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 컨트롤러 객체
다른 리소스를 관리하는 k8s 리소스.  
API와 연동하며, 시스템의 현재 상태를 바람직한 상태로 만들려고 한다.  
레이블 셀렉터를 통해 자신이 관리하는 리소스를 식별한다.  

### 디플로이먼트
파드를 관리하는 객체.  
특정 노드에서 파드가 유실되면 다른 노드에서 실행한다.  
디플로이먼트가 관리하는 파드는 서로 다른 노드에서 동작할수도 있다.   
레이블 셀렉터를 통해 자신이 관리하는 파드를 식별한다.  

### 애플리케이션 매니페스트
애플리케이션의 배포에 필요한 내용들이 기술되어있는 스크립트.  
형상 관리 도구등을 통하여 애플리케이션을 관리하고, 다른 k8s 클러스터에서도 동일한 애플리케이션 배포가 가능하도록 해준다.  

### YAML
Json 포맷의 불편한점을 개선한 상위호환 확장자. 주석 사용가능, 쌍따옴표 생략 등...  
k8s의 애플리케이션 매니페스트는 YAML로 저장이 가능하다.  


## 실습

### 주요 요점들
- 디버깅을 위해 원하는 파드를 컨트롤러 객체에서 분리하여(레이블 정보 변경) 직접 접속할 수 있다. 
- 디플로이먼트를 생성하면 디플로이먼트가 k8s api를 확인하고 자동으로 파드를 만든다.
- k8s에서는 key-value 쌍을 통해서 리소스끼리 연결하거나(디플로이먼트-파드) 레이블에 원하는 값을 담는다.  
- 디플로이먼트가 생성한 파드 이름은 객체 이름 뒤에 무작위 문자열이 붙는다.  
- 레이블 정보를 직접 수정하면 디플로이먼트가 해당 파드를 더이상 인식하지 못한다.  
- exec와 레이블 정보로 pod에 접근이 가능하다.  
- 컨트롤러 객체는 해당 객체가 만든 리소스를 관리한다. 외부 간섭이 발생해도, 이를 다시 복구한다.  


### 매니페스트 파일
pod.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-kiamol-3
spec:
  containers:
    - name: web
      image: kiamol/ch02-hello-kiamol
```

deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-kiamol-4
spec:
  selector:
    matchLabels:
      app: hello-kiamol-4
  template:
    metadata:
      labels:
        app: hello-kiamol-4
    spec:
      containers:
        - name: web
          image: kiamol/ch02-hello-kiamol
```

### 파드 생성 및 확인
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 조금 전과 같은 웹 애플리케이션을 실행하는 디플로이먼트
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # hello-kiamol-2를 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl create deployment hello-kiamol-2 --image=kiamol/ch02-hello-kiamol
deployment.apps/hello-kiamol-2 created
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 파드의 목록을 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE 
hello-kiamol                      1/1     Running   1          102m
hello-kiamol-2-787f8db75d-n9tzt   1/1     Running   0          4s
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 디플로이먼트가 부여한 파드의 레이블 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get deploy hello-kiamol-2 -o jsonpath='{.spec.template.metadata.labels}'
{"app":"hello-kiamol-2"}
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 앞서 출력한 레이블을 가진 파드의 목록 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -l app=hello-kiamol-2
NAME                              READY   STATUS    RESTARTS   AGE
hello-kiamol-2-787f8db75d-n9tzt   1/1     Running   0          23m
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 모든 파드의 이름과 레이블 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
NAME                              LABELS
hello-kiamol                      map[run:hello-kiamol]
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 디플로이먼트가 생성한 파드의 app 레이블 수정
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl label pods -l app=hello-kiamol-2 --overwrite app=hello-kiamol-x
pod/hello-kiamol-2-787f8db75d-n9tzt labeled
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 파드가 또 하나 생성됐다
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
NAME                              LABELS
hello-kiamol                      map[run:hello-kiamol]
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-x pod-template-hash:787f8db75d]
hello-kiamol-2-787f8db75d-tfshk   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # app이라는 레이블이 부여된 모든 파드의 이름과 레이블 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -l app -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
NAME                              LABELS
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-x pod-template-hash:787f8db75d]
hello-kiamol-2-787f8db75d-tfshk   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 디플로이먼트의 관리를 벗어난 파드의 app 레이블을 원래대로 수정
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl label pods -l app=hello-kiamol-x --overwrite app=hello-kiamol-2
pod/hello-kiamol-2-787f8db75d-n9tzt labeled
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 파드의 목록을 다시 한 번 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -l app -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
NAME                              LABELS
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
hello-kiamol-2-787f8db75d-tfshk   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pods -l app -o custom-columns=NAME:metadata.name,LABELS:metadata.labels
NAME                              LABELS
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
```
```powershell
hello-kiamol-2-787f8db75d-n9tzt   map[app:hello-kiamol-2 pod-template-hash:787f8db75d]
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl port-forward deploy/hello-kiamol-2 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
Handling connection for 8080
Handling connection for 8080
```
```powershell
C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl apply -f pod.yaml
pod/hello-kiamol-3 created

C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
hello-kiamol-3   1/1     Running   0          8s

C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl apply -f https://raw.githubusercontent.com/sixeyed/kiamol/master/ch02/pod.yaml
pod/hello-kiamol-3 unchanged

PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 디플로이먼트의 매니페스트로 애플리케이션 실행
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl apply -f deployment.yaml
deployment.apps/hello-kiamol-4 created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 새로운 디플로이 먼트가 만든 파드 찾기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl get pods -l app=hello-kiamol-4
NAME                              READY   STATUS    RESTARTS   AGE     
hello-kiamol-4-568f7fbc88-d5g9g   1/1     Running   0          29s
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 처음 실행한 파드의 내부 IP 주소 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl get pod hello-kiamol -o custom-columns=NAME:metadata.name,POD_IP:status.podIP   
NAME           POD_IP
hello-kiamol   10.1.0.43

# 파드 내부와 연결할 대화형 셸 실행
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl exec -it 
hello-kiamol sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
/ # hostname -i
10.1.0.43
/ # wget -O - http://localhost | head -n 4
Connecting to localhost (127.0.0.1:80)      
writing to stdout
<html>
-                      <body>
100%     <h1>
      Hello from Chapter 2!
|***********************|   353  0:00:00 ETA
written to stdout
/ # ls
bin                   media                 srv
dev                   mnt                   sys
docker-entrypoint.d   opt                   tmp
docker-entrypoint.sh  proc                  usr
etc                   root                  var
home                  run
lib                   sbin
/ # exit
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02>
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 실행 중인 모든 파드의 목록 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
hello-kiamol                      1/1     Running   0          34m
hello-kiamol-3                    1/1     Running   0          80m
hello-kiamol-4-568f7fbc88-d5g9g   1/1     Running   0          59m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 모든 파드 삭제
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl delete pods --all
pod "hello-kiamol" deleted
pod "hello-kiamol-3" deleted
pod "hello-kiamol-4-568f7fbc88-d5g9g" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> # 모든 파드가 삭제되었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
hello-kiamol-4-568f7fbc88-ckkqc   1/1     Running   0          30s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch02> 
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
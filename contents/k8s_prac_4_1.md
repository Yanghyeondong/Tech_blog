---
date: '2024-01-19'
title: '『쿠버네티스 교과서』실습 4장 part 1'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 컨테이너의 장점과 환경 설정값
컨테이는 테스트 환경부터 운영 환경까지 전체 배포 절차가 이미지화되어 진행되기 때문에
의존 모듈 차이로인한 실패가 거의 없다. 단, 환경마다 차이가 완전히 없는 것은 아니여서 이러한 이유로
설정값을 사용하기도 한다.

### 컨피그맵와 비밀값의 특징
포맷 제한없이 데이터 보유가 가능하다. 클러스터 속에서 다른 리소스와 독립적인 장소에 보관된다.  
파드의 정의에서 해당 값들을 불러오도록 할 수 있다.

### 컨피그맵
파드에서 읽어 들이는 데이터를 저장하는 리소스.  
키, 값 쌍이나 텍스트, 바이너리등 다양한 형태로 전달가능.  
파드에서 컨피그맵 값의 변경은 불가하다. 

### k8s의 출처별 환경변수 우선순위
1. 컨테이너 이미지
   기본 설정값은 컨테이너 이미지에 포함시킨다. 모든 환경에 공통적으로 적용되는 일부설정.
2. 컨피그맵
   각 환경의 실제 설정값을 담아서 컨테이너 파일 시스템에 전달한다. 지정한 경로에 설정 데이터를 파일 형태로 주입하거나 컨테이너 이미지에 담긴 파일을 덮어쓰는 형태다.
3. 디플로이먼트 파드 정의
   변경이 필요한 설정값을 디플로이먼트 파드 정의에 적용시킨다.  
  

### 컨피그앱 파일 추가
k8s 에서는 컨테이너 파일 시스템 구성에 컨피그맵도 추가할 수 있다.  
컨피그맵은 디렉터리, 각 항목은 파일 형태로 컨테이너 파일 시스템에 추가된다.  

### 컨피그앱 마운트 주의사항
기존 경로를 덮어쓸경우, 병합이 아니라 기존 파일의 삭제가 발생한다.  
이는 애플리케이션 컨테이너 오류로 이어지고, k8s에서 몇번의 파드 재시작을 거친이후 잠시 멈춘다.

### data와 string data의 차이
stringData 필드는 base64 인코딩이 필요 없는 일반적인 텍스트 형식으로 키-값 쌍을 저장한다.  
data 필드는 base64로 인코딩된 키-값 쌍을 저장한다.  

## 실습

### 주요 요점들
- 환경변수는 파드의 생애 주기 내내 변하지 않는다! 변경을 위해서는 파드 교체 필요.  
- env에서 정의된 값이 envFrom에서 정의된 값보다 우선된다.  
- 파드가 동작중인 상황에서 컨피그맵을 업데이트하면 컨테이너에 전달은 되지만 애플리케이션에 따라 결과가 달라진다.
- k8s에서 마운트된 파일은 심링크를 통해 설정된 경로로 연결된다.

### 매니페스트 파일
sleep-with-configMap-env-file.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sleep
spec:
  selector:
    matchLabels:
      app: sleep
  template:
    metadata:
      labels:
        app: sleep
    spec:
      containers:
        - name: sleep
          image: kiamol/ch03-sleep
          envFrom:
          - configMapRef:
              name: sleep-config-env-file
          env:
          - name: KIAMOL_CHAPTER
            value: "04"
          - name: KIAMOL_SECTION
            valueFrom:
              configMapKeyRef:              
                name: sleep-config-literal
                key: kiamol.section

```
todo-web-dev
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-web
spec:
  selector:
    matchLabels:
      app: todo-web
  template:
    metadata:
      labels:
        app: todo-web
    spec:
      containers:
        - name: web
          image: kiamol/ch04-todo-list 
          volumeMounts:
            - name: config
              mountPath: "/app/config"
              readOnly: true
      volumes:
        - name: config
          configMap:
            name: todo-web-config-dev

```

### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 설정값 없이 sleep 이미지로 파드 실행
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f sleep/sleep.yaml
deployment.apps/sleep created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 파드가 준비될 때까지 대기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl wait --for=condition=Ready pod -l app=sleep
pod/sleep-568fb49bb7-cll7f condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 파드 속 컨테이너에 설정된 몇 가지 환경 변수의 값을 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/sleep -- printenv HOSTNAME KIAMOL_CHAPTER
sleep-568fb49bb7-cll7f
command terminated with exit code 1

PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 디플로이먼트를 업데이트   
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f sleep/sleep-with-env.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 조금 전과 같은 환경 변수의 값 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/sleep -- printenv HOSTNAME KIAMOL_CHAPTER
sleep-675cc588c6-mfm4l
04
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 명령행 도구를 사용해 컨피그맵 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl create configmap sleep-config-literal --from-literal=kiamol.section='4.1'
configmap/sleep-config-literal created
PS C:\Users\hdyang\Desktop\Project\k8s-practice> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 컨피그맵에 들어 있는 데이터 확인 
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get cm sleep-config-literal
NAME                   DATA   AGE
sleep-config-literal   1      0s
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 컨피그맵의 상세 정보를 보기 좋게 출력 
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl describe cm sleep-config-literal
Name:         sleep-config-literal
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
kiamol.section:
----
4.1

BinaryData
====

Events:  <none>
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 예제 4-2와 같이 정의가 수정된 파드 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl apply -f sleep/sleep-with-configMap-env.yaml
error: the path "sleep/sleep-with-configMap-env.yaml" does not exist
PS C:\Users\hdyang\Desktop\Project\k8s-practice> cd .\ch04\
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 예제 4-2와 같이 정의가 수정된 파드 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f sleep/sleep-with-configMap-env.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 파드 속의 환경 변수가 적용되었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/sleep -- sh -c 'printenv | grep "^KIAMOL"'
KIAMOL_SECTION=4.1
KIAMOL_CHAPTER=04
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 예제 4-2와 같이 정의가 수정된 파드 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl apply -f sleep/sleep-with-configMap-env.yaml
error: the path "sleep/sleep-with-configMap-env.yaml" does not exist
PS C:\Users\hdyang\Desktop\Project\k8s-practice> cd .\ch04\
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 예제 4-2와 같이 정의가 수정된 파드 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f sleep/sleep-with-configMap-env.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 파드 속의 환경 변수가 적용되었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/sleep -- sh -c 'printenv | grep "^KIAMOL"'
KIAMOL_SECTION=4.1
KIAMOL_CHAPTER=04 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 환경 파일의 내용으로 컨피그맵 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl create configmap sleep-config-env-file --from-env-file=sleep/ch04.env
configmap/sleep-config-env-file created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 컨피그맵의 상세 정보 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get cm sleep-config-env-file
NAME                    DATA   AGE
sleep-config-env-file   3      0s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 새로운 컨피그맵의 설정을 적용해 파드 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f sleep/sleep-with-configMap-env-file.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 컨테이너에 적용된 환경 변수의 값 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/sleep -- sh -c 'printenv | grep "^KIAMOL"'
KIAMOL_EXERCISE=try it now
KIAMOL_SECTION=4.1        
KIAMOL_CHAPTER=04
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 서비스와 함께 애플리케이션 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/todo-web.yaml
service/todo-web created
deployment.apps/todo-web created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 파드가 준비 상태가 될 때까지 대기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl wait --for=condition=Ready pod -l app=todo-web
pod/todo-web-55dfcd87b9-wd2gh condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 애플리케이션에 접근하기 위한 주소를 파일로 출력
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get svc todo-web -o jsonpath='http://{.status.loadBalancer.ingress[0].*}:8080'
http://localhost:8080
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 웹 브라우저에서 애플리케이션에 접근한 다음, 기능을 점검
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 그 다음 경로 /config에 접근
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 애플리케이션 로그 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl logs -l app=todo-web
warn: ToDoList.Pages.ConfigModel[0]
      Attempt to view config settings
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 기본 설정값이 담긴 설정 파일 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-web -- sh -c 'ls -l /app/app*.json'
-rw-r--r--    1 root     root           469 Sep  1  2022 /app/appsettings.json
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 볼륨 마운트로 주입된 설정 파일 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-web -- sh -c 'ls -l /app/config/*.json'
lrwxrwxrwx    1 root     root            18 Jan 17 05:16 /app/config/config.json -> ..data/config.json
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 볼륨 마운트가 실제로 읽기 전용인지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-web -- sh -c 'echo ch04 >> /app/config/config.json'
sh: can't create /app/config/config.json: Read-only file system
command terminated with exit code 1
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 컨피그맵 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/configMaps/todo-web-config-dev-with-logging.yaml
configmap/todo-web-config-dev configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 업데이트된 컨피그맵이 파드에 반영될 때까지 대기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> sleep 120
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 설정 파일에 반영되었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-web -- sh -c 'ls -l /app/config/*.json'
lrwxrwxrwx    1 root     root            18 Jan 17 05:16 /app/config/config.json -> ..data/config.json  
lrwxrwxrwx    1 root     root            19 Jan 17 05:44 /app/config/logging.json -> ..data/logging.json
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 애플리케이션에 접근해 로그 출력이 변화했는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl logs -l app=todo-web
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl logs -l app=todo-web
dbug: ToDoList.Pages.IndexModel[0]
      GET / called
dbug: ToDoList.Pages.IndexModel[0]
      Fetched count: 0 from service
```

## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
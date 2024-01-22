---
date: '2024-01-22'
title: '『쿠버네티스 교과서』실습 4장 part 2'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### k8s 비밀값
컨피그맵과 비슷하지만, 클러스터 내부에서 별도로 관리되며, 노출이 최소화되는 리소스이다.  
해당 값을 사용하는 노드에만 전달되며, 디스크가 아닌 메모리에 저장된다. 전달 과정과 저장에 모두 암호화가 적용된다.

### 비밀값 주의점
비밀값의 파드 컨테이너에 전달된 순간부터는 평문이 담긴 텍스트파일이 된다. 이를 환경변수로 줄 경우, 애플리케이션에 따라 다른곳에 노출될 위험이 있다. 실제 서비스 운영에서는 민감한 데이터를 YAML에 포함시켜서는 안된다. 애플리케이션을 배치할 때 추가적인 처리를 거쳐야한다. ex.) 깃허브 시크릿 기능 활용

### k8s에서의 애플리케이션 설정관리
애플리케이션의 핵심적인 요구사항 = 외부 환경에서 설정값을 주입받는 것.  
우선순위에 따라 파일과 환경변수를 필요로 하는것이 이상적이다.  

핵심 사항
1. 애플리케이션의 중단 없이 설정 변경에 대응이 필요한가?
2. 민감 정보를 어떻게 관리할 것인가?

무중단 업데이트가 중요하다면, 환경 변수사용은 힘들며, 볼륨 마운트를 이용하여 설정 파일을 수정하는 방식이 필요하다.  
민감 정보의 경우, YAML 탬플릿 파일로 컨피그 맵과 비밀값 정의가 생성되는 자동화 배치를 활용. ex.) Azure KeyVault 등.

### 


## 실습

### 주요 요점들
- 비밀값은 decribe를 써도 키와 데이터 길이만 나온다.
- 비밀값을 바로 읽으려고 하면 base64로 난독화되어 있다.  


### 매니페스트 파일
sleep-with-secret.yaml
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
          env:
          - name: KIAMOL_SECRET
            valueFrom:
              secretKeyRef:              
                name: sleep-secret-literal
                key: secret
```
todo-db-test.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-db
spec:
  ports:
    - port: 5432
      targetPort: 5432
  selector:
    app: todo-db
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-db
spec:
  selector:
    matchLabels:
      app: todo-db
  template:
    metadata:
      labels:
        app: todo-db
    spec:
      containers:
        - name: db
          image: postgres:11.6-alpine
          env:
          - name: POSTGRES_PASSWORD_FILE
            value: /secrets/postgres_password
          volumeMounts:
            - name: secret
              mountPath: "/secrets"
      volumes:
        - name: secret
          secret:
            secretName: todo-db-secret-test
            defaultMode: 0400
            items:
            - key: POSTGRES_PASSWORD
              path: postgres_password
```
### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 평문 리터럴로 비밀값 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl create secret generic sleep-secret-literal --from-literal=secret=shh...
secret/sleep-secret-literal created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 비밀값의 상세 정보 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl describe secret sleep-secret-literal
Name:         sleep-secret-literal
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
secret:  6 bytes
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 비밀값의 평문 확인(base64 인코딩됨)
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get secret sleep-secret-literal -o jsonpath='{.data.secret}'
c2hoLi4u
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 비밀값의 평문 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get secret sleep-secret-literal -o jsonpath='{.data.secret}' | base64 -d
shh...
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 비밀값 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/secrets/todo-db-secret-test.yaml
secret/todo-db-secret-test created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 데이터 값이 인코딩되었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get secret todo-db-secret-test -o jsonpath='{.data.POSTGRES_PASSWORD}'
a2lhbW9sLTIqMio=
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 비밀값 객체의 애너테이션에 저장된 내용 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl get secret todo-db-secret-test -o jsonpath='{.metadata.annotations}'
{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"v1\",\"kind\":\"Secret\",\"metadata\":{\"annotations\":{},\"name\":\"todo-db-secret-test\",\"namespace\":\"default\"},\"stringData\":{\"POSTGRES_PASSWORD\":\"kiamol-2*2*\"},\"type\":\"Opaque\"}\n"}
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> cd ch04
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 예제 4-13의 정의 배치        
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/todo-db-test.yaml
service/todo-db created
deployment.apps/todo-db created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 데이터베이스 파드의 로그 확인(조금 기다려야 한다)
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl logs -l app=todo-db --tail 1
2024-01-17 12:30:06.231 UTC [1] LOG:  database system is ready to accept connections
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 패스워드 설정 파일의 권한 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-db -- sh -c 'ls -l $(readlink -f /secrets/postgres_password)'
-r--------    1 root     root            11 Jan 17 12:29 /secrets/..2024_01_17_12_29_57.20743244/postgres_password
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> cd ch04
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 예제 4-13의 정의 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/todo-db-test.yaml
service/todo-db created
deployment.apps/todo-db created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 데이터베이스 파드의 로그 확인(조금 기다려야 한다)
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl logs -l app=todo-db --tail 1
2024-01-17 12:30:06.231 UTC [1] LOG:  database system is ready to accept connections
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 패스워드 설정 파일의 권한 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-db -- sh -c 'ls -l $(readlink -f /secrets/postgres_password)'
-r--------    1 root     root            11 Jan 17 12:29 /secrets/..2024_01_17_12_29_57.20743244/postgres_password
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # PostgreSQL 데이터베이스를 사용하도록 설정된 컨피그맵을 배치한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/configMaps/todo-web-config-test.yaml
configmap/todo-web-config-test created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # PostgreSQL 데이터베이스에 접속할 인증 정보가 들어 있는 비밀값을 배치한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/secrets/todo-web-secret-test.yaml
secret/todo-web-secret-test created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 디플로이먼트 속 파드는 위의 컨피그맵과 비밀값을 사용하도록 설정됐다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl apply -f todo-list/todo-web-test.yaml
service/todo-web-test created
deployment.apps/todo-web-test created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> # 애플리케이션 컨테이너 속 데이터베이스 인증 정보 파일을 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch04> kubectl exec deploy/todo-web-test -- cat /app/secrets/secrets.json
{
  "ConnectionStrings": {
    "ToDoDb": "Server=todo-db;Database=todo;User Id=postgres;Password=kiamol-2*2*;"
  }
}
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
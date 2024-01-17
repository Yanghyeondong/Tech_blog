---
date: '2024-01-17'
title: '『쿠버네티스 교과서』실습 3장 part 1'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 파드끼리의 통신
표준 네트워크 프로토콜을 지원한다. TCP, UDP 등.
단, IP의 변화에 대응하기위해서(pod의 생애주기) 서비스의 어드레스 디스커버리를 사용한다.  

### k8s의 서비스
파드에서 들어오고 나오는 통신 트래픽의 라우팅을 맡는 리소스.  
파드와 파드가 가진 네트워크 주소를 추상화한다.  
서비스의 IP 주소로 요청을 보내면, 서비스와 연결된 파드의 실제 IP 주소로 요청을 연결해준다.  

### k8s의 DNS서버
서비스 이름과 IP 주소를 대응시켜준다.  
서비스가 생성되면 서비스의 IP 주소가 DNS 서버에 등록된다.  
해당 주소는 정적 주소로 서비스가 삭제될 때까지 변하지 않는다.  

### 서비스 주의할 점
k8s DNS는 k8s 서비스의 IP를 알려주는데, 서비스는 TCP와 UDP만 지원한다.  
예를 들어, ping의 경우 ICMP 프로토콜을 사용하여 k8s 서비스에서는 지원하지 않는다.  
따라서 직접 파드의 IP를 kubectl로 찾아내서 진행해야한다!  

### 클러스터 IP
클러스터 내부 통신을 위한 IP. 외부에서의 접근은 불가능하다.  
네트워크상에 실재하지 않는 가상 IP 주소이다!  

### 로드밸런서
클러스터 외부에서 들어오는 트래픽을 파드에 전달한다.  
트래픽을 받은 노드(서버)가 아닌 다른 노드(서버)에서 실행되는 파드에도 트래픽을 전달할 수 있다.  
= 로드밸런서의 커버 범위는 클러스터 전체!  

#### 주의할 점
Docker Desktop, k3s 등의 환경에서는 여러개의 로드밸런서 사용을 위해서는 이들의 포트를 다르게 설정해야한다. AKS, EKS 등의 클라우드 환경은 로드밸런서 생성시 서비스의 IP 주소자체도 달라진다.  

### 노드포트
클러스터 외부에서 들어오는 트래픽을 파드에 전달한다. 
클러스터를 구성하는 모든 노드가 노드포트에 지정된 포트를 주시하며 들어온 트래픽을 대상 파드의 대상 포트로 전달한다.  


## 실습

### 주요 요점들
- 파드의 IP 주소는 파드 재시작시 변경된다. 따라서 지속적으로 이용은 불가.  
- 서비스를 사용하면 파드의 IP가 변경되어도 레이블을 기반으로 지속적인 이용이 가능하다.  
- 서비스와 파드는 레이블 셀렉터를 통해서 느슨하게 연결된다.  
- 서비스를 사용하면 직접 IP를 적지않아도 k8s DNS 서버에 네임을 조회하여 IP 주소를 알 수 있다.
- 외부의 트래픽을 처리하기 위해서는 로드밸런서가 필요, 포트 포워딩은 디버깅 용도로만 

### 매니페스트 파일
sleep2-service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: sleep-2
spec:
  selector:
    app: sleep-2
  ports:
    - port: 80
```

### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 각각 하나의 파드를 실행하는 두 개의 디플로이먼트를 생성한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f sleep/sleep1.yaml -f sleep/sleep2.yaml
deployment.apps/sleep-1 unchanged
deployment.apps/sleep-2 unchanged
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 파드가 완전히 시작될 때까지 기다린다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl wait --for=condition=Ready pod -l app=sleep-2
pod/sleep-2-7f69798f94-s92wc condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 두 번째 파드의 IP 주소를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get pod -l app=sleep-2 --output jsonpath='{.items[0].status.podIP}'
10.1.0.61
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 같은 주소를 사용해 두 번째 파드에서 첫 번째 파드로 ping을 보낸다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl exec deploy/sleep-1 -- ping -c 2 $(kubectl get pod -l app=sleep-2 --output jsonpath='{.items[0].status.podIP}')

PING 10.1.0.61 (10.1.0.61): 56 data bytes
64 bytes from 10.1.0.61: seq=0 ttl=64 time=0.066 ms
64 bytes from 10.1.0.61: seq=1 ttl=64 time=0.046 ms      

--- 10.1.0.61 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.046/0.056/0.066 ms
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 파드의 현재 IP 주소를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get pod -l app=sleep-2 --output jsonpath='{.items[0].status.podIP}'
10.1.0.61
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 디플로이먼트가 새 파드를 만들도록 현재 파드를 삭제한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl delete pods -l app=sleep-2
pod "sleep-2-7f69798f94-s92wc" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 새로 대체된 파드의 IP 주소를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get pod -l app=sleep-2 --output jsonpath='{.items[0].status.podIP}'
10.1.0.63
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 서비스를 배포한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f sleep/sleep2-service.yaml
service/sleep-2 created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 서비스의 상세 정보를 출력한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc sleep-2
NAME      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
sleep-2   ClusterIP   10.102.170.140   <none>        80/TCP    1s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 파드와 통신이 잘 되는지 확인한다 -- 이 명령은 실패한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl exec deploy/sleep-1 -- ping -c 1 sleep-2
PING sleep-2 (10.102.170.140): 56 data bytes

--- sleep-2 ping statistics ---
1 packets transmitted, 0 packets received, 100% packet loss
command terminated with exit code 1
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 사이트와 API를 담당할 두 개의 디플로이먼트를 실행한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f numbers/api.yaml -f numbers/web.yaml
deployment.apps/numbers-api created
deployment.apps/numbers-web created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 파드의 준비가 끝날 때까지 기다린다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl wait --for=condition=Ready pod -l app=numbers-web
pod/numbers-web-76447f6964-4dxm8 condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 애플리케이션에 포트포워딩을 적용한다      
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl port-forward deploy/numbers-web 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 브라우저에서 http://localhost:8080에 접근해
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 화면상의 Go 버튼을 클릭하면 오류가 발생한다   

PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl apply -f numbers/api-service.yaml
service/numbers-api created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 서비스의 상세 정보를 출력한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get svc numbers-api
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
numbers-api   ClusterIP   10.103.126.82   <none>        80/TCP    0s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 애플리케이션에 접근할 수 있도록 포트포워딩을 적용한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl port-forward deploy/numbers-web 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
Handling connection for 8080
Handling connection for 8080
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 브라우저에서 http://localhost:8080에 접근해
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # Go 버튼을 클릭하면 잘 실행된다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # API 파드의 이름과 IP 주소를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get pod -l app=numbers-api -o custom-columns=NAME:metadata.name,POD_IP:status.podIP
NAME                           POD_IP
numbers-api-545b9d9ccd-bm8rs   10.1.0.70
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # API 파드를 수동으로 삭제한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl delete pod -l app=numbers-api
pod "numbers-api-545b9d9ccd-bm8rs" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 새로 생성된 대체 파드의 이름과 IP 주소를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl get pod -l app=numbers-api -o custom-columns=NAME:metadata.name,POD_IP:status.podIP
NAME                           POD_IP
numbers-api-545b9d9ccd-2vtfd   <none>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> # 웹 애플리케이션에 포트포워딩을 적용한다   
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch03> kubectl port-forward deploy/numbers-web 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
Handling connection for 8080
Handling connection for 8080
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
---
date: '2024-01-23'
title: '『쿠버네티스 교과서』실습 5장 part 1'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 파드속 컨테이너 파일 시스템 구성 방식
1. 컨테이너 이미지가 초기 내용을 제공
2. 기록 가능 레이어에 파일의 수정이나 새로운 파일이 기록됨
3. 볼륨 마운트

#### 주의사항
파드가 새로 생성되면 기존 기록 가능 레이어의 데이터는 사라진다!

### 공디렉터리 emptyDir
파드 수준의 디렉토리. 공디렉터리 볼륨에 저장된 데이터는 컨테이너가 대체되어도 유지된다. 단, 파드가 대체될 경우 사라진다. 로컬 캐시로서 활용해 애플리케이션의 성능을 높일 수 있다.  

### 호스트경로 볼륨
데이터가 특정 노드에 고정되게 된다.  

#### 장점
손쉽게 접근이 가능하다. 
statefull 애플리케이션에 유리하다. 
statefull = 트랜잭션의 컨텍스트와 내역이 저장되는 형태.

#### 단점
해당 노드에서만 쓸 수 있기에 전체 클러스터에서 쓰지 못한다.
보안적으로 취약하다. 노드의 파일 시스템 전체에 파드 컨테이너가 접근할 수 있게 된다. 단, 이는 볼륨과 마운트 정의에서 SubPath를 활용하면 된다.  

### k8s 분산 스토리지 시스템
AKS - Azure 파일스, Azure 디스크  
EKS - Elastic Block Store
온프레미스 - NFS, GlusterFS

파드 : 컴퓨팅 계층의 추상
서비스 : 네트워크 계층의 추상
영구볼륨&클레임 : 스토리지 계층의 추상

### 분산 스토리지가 없을 경우
특정 노드에 레이블을 부여하고 해당 노드의 로컬볼륨을 영구볼륨으로 활용.

### 영구볼륨 클레임
파드가 사용하는 스토리지의 추상. 파드가 영구 볼륨을 사용하기 위해 요청하는 대상. 접근 유형과 스토리지 용량, 스토리지 유형을 지정한다. 스토리지 유형을 지정하지 않으면 쿠버네티스가 현존하는 영구볼륨 중 찾아서 연결해준다. 영구볼륨 클레임과 영구 볼륨과 1대1의 대응을 가진다.

### TIP
클러스터에서 각 노드에 로그인할 권한이 없다면, 호스트경로 마운트로 노드의 루트 디렉터리를 마운트한 파드를 활용해서 로컬 볼륨에 원하는 작업을 할 수 있다.

## 실습

### 주요 요점들
- 영구볼륨과 연결되지 않은 클레임을 참조하는 파드를 배치할려고 하면 오류가 발생한다.
- 영구볼륨을 명시적으로 생성 - 정적 프로비저닝
- 클레임에서 사용가능한 볼륨이 없으면 peding 상태가 된다


### 매니페스트 파일
sleep-with-emptyDir.yaml
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
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          emptyDir: {}
```
persistentVolume.yaml
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv01
spec:
  capacity:
    storage: 50Mi
  accessModes:
    - ReadWriteOnce
  local:
    path: /volumes/pv01 
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
          - key: kiamol
            operator: In
            values:
              - ch05
```
postgres-persistentVolumeClaim.yaml
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 40Mi
  storageClassName: ""
```
### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # sleep 파드를 배치한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f sleep/sleep.yaml
deployment.apps/sleep unchanged
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 속에 파일 하나를 생성한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- sh -c 'echo ch05 > /file.txt; ls /*.txt'
/file.txt
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 ID를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pod -l app=sleep -o jsonpath='{.items[0].status.containerStatuses[0].containerID}'     
docker://2b8e762f528550bbf71c5f23d5de88ac87667d4a13aca0733ea0beb1e10639ab
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파드가 재시작하도록 컨테이너의 모든 프로세스를 강제 종료한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec -it deploy/sleep -- killall5
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 대체된 컨테이너의 ID를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl get pod -l app=sleep -o jsonpath='{.items[0].status.containerStatuses[0].containerID}'
docker://77736249d5c4e43383981a0be037b5a60d2f86404bbf0cd0466f645f9a62d88f
PS C:\Users\hdyang\Desktop\Project\k8s-practice>
PS C:\Users\hdyang\Desktop\Project\k8s-practice> # 조금 전 생성했던 파일이 사라졌다
PS C:\Users\hdyang\Desktop\Project\k8s-practice> kubectl exec deploy/sleep -- ls /*.txt

ls: /*.txt: No such file or directory
command terminated with exit code 1
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 공디렉터리 볼륨을 사용하도록 sleep 파드 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f sleep/sleep-with-emptyDir.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 볼륨 마운트 속 파일 목록 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- ls /data
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 빈 디렉터리에 파일 하나 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- sh -c 'echo ch05 > /data/file.txt; ls /data'
file.txt
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 ID 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pod -l app=sleep -o jsonpath='{.items[0].status.containerStatuses[0].containerID}'
docker://5808d8b3dfe26dba2d68e9eb9d78ac981d6c2c6ab8d7e6421d9925647c656b24
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 프로세스 강제 종료
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- killall5
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 대체 컨테이너의 ID가 바뀌었는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pod -l app=sleep -o jsonpath='{.items[0].status.containerStatuses[0].containerID}'
docker://6a769d2c72b7f0708eb151c2930f4338a0344b1ebfbd3799b2c1fe186d12d057
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 볼륨이 마운트된 경로의 파일 내용 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- cat /data/file.txt
ch05
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파이 애플리케이션을 배치한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f pi/v1/
configmap/pi-proxy-configmap created
service/pi-proxy created
deployment.apps/pi-proxy created
service/pi-web created
deployment.apps/pi-web created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파드가 준비 상태가 될 때까지 대기한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl wait --for=condition=Ready pod -l app=pi-web
pod/pi-web-66544ccb68-9pf2w condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 로드밸런서 서비스의 URL을 출력한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get svc pi-proxy -o jsonpath='http://{.status.loadBalancer.ingress[0].*}:8080/?dp=30000'
http://localhost:8080/?dp=30000
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 위 URL에 접근한 다음 페이지를 새로고침하라
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 프록시에 저장된 캐시를 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/pi-proxy -- ls -l /data/nginx/cache
total 12
drwx------    3 nginx    nginx         4096 Jan 18 08:01 4
drwx------    3 nginx    nginx         4096 Jan 18 08:01 5
drwx------    3 nginx    nginx         4096 Jan 18 08:01 d
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/pi-proxy -- ls -l /data/nginx/cache
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 프록시 파드를 삭제한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl delete pod -l app=pi-proxy
pod "pi-proxy-5498f7cdd5-jmdjj" deleted
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 새로 생성된 대체 파드의 캐시 디렉터리 내용을 확인한다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/pi-proxy -- ls -l /data/nginx/cache
total 0
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/pi-proxy -- ls -l /data/nginx/cache
total 8
drwx------    3 nginx    nginx         4096 Jan 18 08:07 2
drwx------    3 nginx    nginx         4096 Jan 18 08:07 4
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 호스트경로 볼륨이 마운트된 파드 실행
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f sleep/sleep-with-hostPath.yaml
deployment.apps/sleep unchanged
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 속 로그 파일 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- ls -l /var/log
total 0
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 노드 파일 시스템의 로그 파일 내용 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- ls -l /node-root/var/log
total 0
drwxr-xr-x    2 root     root           360 Jan 18 08:52 containers
drwxr-xr-x   19 root     root           380 Jan 18 08:52 pods      
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>                                            
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너의 사용자명 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- whoami
root
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파드 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f sleep/sleep-with-hostPath-subPath.yaml
deployment.apps/sleep unchanged
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 노드 파일 시스템에서 파드의 로그 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- sh -c 'ls /pod-logs | grep _pi-'

default_pi-proxy-5584cb46f7-zlx4s_5463a515-2ff4-4ee3-a17c-831400c8f92c
default_pi-proxy-59d4899589-mg7qv_6652d70f-100d-440b-8c90-553d20900c96
default_pi-web-66544ccb68-9pf2w_501b7421-5b9e-4c8a-b782-a016c0154542  
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 컨테이너 로그 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- sh -c 'ls /container-logs | grep nginx'                                                                                        
pi-proxy-59d4899589-mg7qv_default_nginx-db67e8d56dc203701eeb2e361ef59dbc69e758622ff0ac3aec708418351e09f0.log
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 레이블 셀렉터로 노드의 존재 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get nodes -l kiamol=ch05
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   22h   v1.28.2
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 레이블이 부여된 노드의 로컬 볼륨을 사용하는 영구볼륨을 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f todo-list/persistentVolume.yaml
persistentvolume/pv01 created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨의 상세정보 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pv
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv01   50Mi       RWO            Retain           Available                                   3s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨과 연결될 영구볼륨클레임을 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f todo-list/postgres-persistentVolumeClaim.yaml
persistentvolumeclaim/postgres-pvc created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨클레임의 목록 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pvc
NAME           STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-pvc   Bound    pv01     50Mi       RWO                           4s 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨의 목록 확인 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pv
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                  STORAGECLASS   REASON   AGE 
pv01   50Mi       RWO            Retain           Bound    default/postgres-pvc                           6m7s
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 현재 사용 가능한 영구볼륨 중 일치하는 것이 없는 영구볼륨클레임을 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f todo-list/postgres-persistentVolumeClaim-too-big.yaml
persistentvolumeclaim/postgres-pvc-toobig created                                                                                     kiamol=c
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨클레임의 목록 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pvc
NAME                  STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-pvc          Bound     pv01     50Mi       RWO                           37m
postgres-pvc-toobig   Pending                                                     1s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 노드의 디스크에 접근할 수 있는 sleep 파드를 실행
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f sleep/sleep-with-hostPath.yaml
deployment.apps/sleep configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파드가 준비될 때까지 대기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl wait --for=condition=Ready pod -l app=sleep
pod/sleep-68f96fc8d5-wcs72 condition met
pod/sleep-fb8dfbfd8-qsrf2 condition met
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 영구볼륨에서 사용할 디렉터리를 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- mkdir -p /node-root/volumes/pv01
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 데이터베이스 파드를 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f todo-list/postgres/
secret/todo-db-secret created                                                                                                         kiamol=c
service/todo-db created
deployment.apps/todo-db created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 데이터베이스 파일이 초기화될 때까지 대기
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> sleep 30
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 데이터베이스 파드의 로그를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl logs -l app=todo-db --tail 1
2024-01-18 13:48:35.695 UTC [1] LOG:  database system is ready to accept connections
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 볼륨에 어떤 파일이 생성됐는지 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl exec deploy/sleep -- sh -c 'ls -l /node-root/volumes/pv01 | grep wal'
drwx------    3 70       70              80 Jan 18 13:48 pg_wal
```
## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
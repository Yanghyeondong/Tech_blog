---
date: '2024-01-25'
title: '『쿠버네티스 교과서』실습 5장 part 2'
categories: ['K8s', 'Docker','DevOps']
summary: '엘튼 스톤맨의 『쿠버네티스 교과서』를 바탕으로 k8s 실습을 진행합니다.'
thumbnail: './k8s/k8s.jpg'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### 정적 볼륨 프로비저닝
영구볼륨과 클레임을 명시적으로 생성해서 연결하는 정적 볼륨 프로비저닝 방식. 모든 k8s 클러스터에서 사용할 수 있으며, 스토리지 접근 제약이 큰 조직에서 선호한다.  

- 영구볼륨의 Name, 용량, 경로등을 명시할 수 있다.  

### 동적 볼륨 프로비저닝
영구볼륨 클레임만 생성하면 그에 맞는 영구볼륨을 클러스터에서 동적으로 생성해주는 방식. 어떤 방식으로 스토리지가 구성되는지는 클러스터마다 다를 수 있다. 새로운 사용자 정의 스토리지 유형도 추가할 수 있다.

### reclaimPolicy
클레임이 삭제되었을때 연결된 볼륨을 어떻게 처리할지 지정하는 것.


## 실습

### 매니페스트 파일
postgres-persistentVolumeClaim-dynamic.yaml
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc-dynamic
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
```
postgres-persistentVolumeClaim-storageClass.yaml
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc-kiamol
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: kiamol
  resources:
    requests:
      storage: 100Mi
```

### 
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 예제 5-8에 정의된 영구볼륨클레임을 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f todo-list/postgres-persistentVolumeClaim-dynamic.yaml
persistentvolumeclaim/postgres-pvc-dynamic created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pvc
NAME                   STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-pvc           Bound     pv01                                       50Mi       RWO                           105m
postgres-pvc-dynamic   Bound     pvc-be70912e-fe15-42b5-91e2-9862a041cdbf   100Mi      RWO            hostpath       5s
postgres-pvc-toobig    Pending                                                                                       68m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                          STORAGECLASS   REASON   AGE      
pv01                                       50Mi       RWO            Retain           Bound    default/postgres-pvc                                   111m     
pvc-be70912e-fe15-42b5-91e2-9862a041cdbf   100Mi      RWO            Delete           Bound    default/postgres-pvc-dynamic   hostpath                15s
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 사용자 정의 스토리지 유형이 사용된 영구볼륨클레임을 생성
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f storageClass/postgres-persistentVolumeClaim-storageClass.yaml
persistentvolumeclaim/postgres-pvc-kiamol created
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 위의 클레임을 사용하도록 데이터베이스 파드를 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl apply -f storageClass/todo-db.yaml
deployment.apps/todo-db configured
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 스토리지 관련 리소스를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pvc
NAME                   STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-pvc           Bound     pv01                                       50Mi       RWO                           119m
postgres-pvc-dynamic   Bound     pvc-be70912e-fe15-42b5-91e2-9862a041cdbf   100Mi      RWO            hostpath       13m
postgres-pvc-kiamol    Bound     pvc-00338685-a63a-4616-9901-bb9adbb2fbef   100Mi      RWO            kiamol         8s
postgres-pvc-toobig    Pending                                                                                       81m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                          STORAGECLASS   REASON   AGE
pv01                                       50Mi       RWO            Retain           Bound    default/postgres-pvc                                   125m
pvc-00338685-a63a-4616-9901-bb9adbb2fbef   100Mi      RWO            Delete           Bound    default/postgres-pvc-kiamol    kiamol                  8s
pvc-be70912e-fe15-42b5-91e2-9862a041cdbf   100Mi      RWO            Delete           Bound    default/postgres-pvc-dynamic   hostpath                13m
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> # 파드의 상세 정보를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch05> kubectl get pods -l app=todo-db

NAME                       READY   STATUS    RESTARTS   AGE
todo-db-56c5846894-xkbvz   1/1     Running   0          9s
```

## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
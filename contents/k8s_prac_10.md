---
date: '2024-01-29'
title: '쿠버네티스 Helm 기초 part 1'
categories: ['K8s', 'Docker','DevOps']
summary: 'k8s Helm 실습을 진행합니다.'
thumbnail: './k8s/helm.png'
---
*해당 포스트는 교재 『쿠버네티스 교과서』를 활용하며,*  
*환경은 Kubernetes v1.28. Docker Desktop으로 진행합니다.* 

## 개념 요약

### Helm 헬름
여러개의 YAML 정의 스크립트를 하나의 아티팩트로 묶어 리포지토리에 공유할 수 있다. 헬름 명령으로 컨피그맵, 디플로이먼트, 서비스등의 애플리케이션을 설치할 수 있다.
- 애플리케이션 수준의 추상화를 도와준다

### 헬름 리포지터리
서버에서 사용 가능한 모든 패키지의 색인을 제공, 로컬에 저장했다가 패키지 검색에 사용. 

### 차트
- 애플리케이션의 패키지.
- 로컬 컴퓨터에서 만들거나 리포지터리에 배포 가능.
- 릴리스 이름을 달리해가며 하나의 클러스터에 같은 차트를 여러 개 설치가능.
- YAML 매니페스트를 포함한다.

### Release 객체
install 또는 upgrade 명령을 실행할 때 관련 정보를 담아 생성되는 객체.

### Values 객체
차트에 포함된 기본 값에 사용자가 지정한 값을 오버라이드한 정보를 담아 생성되는 객체.

### Helm 차트 파일 구조
필요한 3가지 요소
1. chart.yaml  
   차트의 메타데이터를 저장
2. values.yaml  
   파라미터의 기본 값을 기록
3. templates 디렉터리  
   템플릿 변수가 포함된 매니페스트 파일을 담은 디렉터리

### Helm 리포지터리
웹 서버에 저장된 차트와 버전의 목록이 담긴 인덱스!
1. 공식 헬름 리포지터리(도커 허브와 유사한 느낌)
2. 차트뮤지엄으로 만든 리포지터리(로컬에서 직접 설정가능)
3. 기타 다른 웹 서버의 리포지터리

## 실습

### 주요 요점들
- Helm 템플릿으로 조건문이나 반복문 설정도 가능하다
- Helm은 하나의 차트로 동일한 애플리케이션을 여러개 실행할 수 있다.


### 매니페스트 파일
web-ping-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
  labels:
    kiamol: {{ .Values.kiamolChapter }}
spec:
  selector:
    matchLabels:
      app: web-ping
      instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: web-ping
        instance: {{ .Release.Name }}
    spec:
      containers:
        - name: app
          image: kiamol/ch10-web-ping
          env:
            - name: TARGET
              value: {{ .Values.targetUrl }}
            - name: METHOD
              value: {{ .Values.httpMethod }}
            - name: INTERVAL
              value: {{ .Values.pingIntervalMilliseconds | quote }}
```

values.yaml
```yaml
# targetUrl - URL of the website to ping
targetUrl: blog.sixeyed.com
# httpMethod - HTTP method to use for pings
httpMethod: HEAD
# pingIntervalMilliseconds - interval between pings in ms
pingIntervalMilliseconds: 30000
# chapter where this exercise is used
kiamolChapter: ch10
```

### 
```powershell
# 초콜레티 설치
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
# 헬름 설치
PS C:\Windows\system32> choco install -y kubernetes-helm
Chocolatey v2.2.2
Installing the following packages:
kubernetes-helm
By installing, you accept licenses for the packages.
Progress: Downloading kubernetes-helm 3.13.3... 100%

kubernetes-helm v3.13.3 [Approved]
kubernetes-helm package files install completed. Performing other installation steps.
Downloading kubernetes-helm 64 bit
  from 'https://get.helm.sh/helm-v3.13.3-windows-amd64.zip'
Progress: 100% - Completed download of C:\Users\hdyang\AppData\Local\Temp\chocolatey\kubernetes-helm\3.13.3\helm-v3.13.3-windows-amd64.zip (15.59 MB).
Download of helm-v3.13.3-windows-amd64.zip (15.59 MB) completed.
Hashes match.
Extracting C:\Users\hdyang\AppData\Local\Temp\chocolatey\kubernetes-helm\3.13.3\helm-v3.13.3-windows-amd64.zip to C:\ProgramData\chocolatey\lib\kubernetes-helm\tools...
C:\ProgramData\chocolatey\lib\kubernetes-helm\tools
 ShimGen has successfully created a shim for helm.exe
 The install of kubernetes-helm was successful.
  Software installed to 'C:\ProgramData\chocolatey\lib\kubernetes-helm\tools'

Chocolatey installed 1/1 packages.
 See the log for details (C:\ProgramData\chocolatey\logs\chocolatey.log).
# 헬름 버전 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice> helm version
version.BuildInfo{Version:"v3.13.3", GitCommit:"c8b948945e52abba22ff885446a1486cb5fd3474", GitTreeState:"clean", GoVersion:"go1.20.11"}
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm repo add kiamol https://kiamol.net
"kiamol" has been added to your repositories
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 로컬 리포지터리 캐시를 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "kiamol" chart repository
Update Complete. ⎈Happy Helming!⎈
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 인덱스 캐시로부터 애플리케이션을 검색
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm search repo vweb --versions
NAME            CHART VERSION   APP VERSION     DESCRIPTION
kiamol/vweb     2.0.0           2.0.0           Simple versioned web app
kiamol/vweb     1.0.0           1.0.0           Simple versioned web app
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice> cd ch10
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 차트에 포함된 파라미터 값의 기본값을 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm show values kiamol/vweb --version 1.0.0
servicePort: 8090
replicaCount: 2
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 파라미터 값의 기본값을 수정해 차트를 설치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm install --set servicePort=8010 --set replicaCount=1 ch10-vweb kiamol/vweb -web kiamol/vweb --version 1.0.0
NAME: ch10-vweb
LAST DEPLOYED: Sat Jan 27 22:31:44 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 설치된 릴리스를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm ls
NAME            NAMESPACE       REVISION        UPDATED                                                                              S
                STATUS   CHART           APP VERSION
ch10-vweb       default         1               2024-01-27 22:31:44.5840187 +0900 KST                                                d
                deployed vweb-1.0.0      1.0.0
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 디플로이먼트의 상태를 확인     
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> kubectl get deploy -l app.kubernetes.io/instance=ch10-vweb --show-labels
NAME        READY   UP-TO-DATE   AVAILABLE   AGE    LABELS
ch10-vweb   1/1     1            1           105s   app.kubernetes.io/instance=ch10-vweb,app.kubernetes.io/managed-by=Helm,app.kubernetes.io/name=vweb,kiamol=ch10
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 레플리카 수를 변경해 릴리스를 업데이트
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm upgrade --set servicePort=8010 --set replicaCount=3 ch10-vweb kiamol/vweb --version 1.0.0
Release "ch10-vweb" has been upgraded. Happy Helming!
NAME: ch10-vweb
LAST DEPLOYED: Sat Jan 27 22:33:30 2024
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE: None
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 레플리카셋의 상태를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> kubectl get rs -l app.kubernetes.io/instance=ch10-vweb
NAME                   DESIRED   CURRENT   READY   AGE
ch10-vweb-5f87499974   3         3         1       106s
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 애플리케이션 URL을 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> kubectl get svc ch10-vweb -o jsonpath='http://{.status.loadBalancer.ingress[0].*}:8010'
http://localhost:8010
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 차트에 들어갈 파일의 유효성을 검증
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm lint web-ping
==> Linting web-ping
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 차트 디렉터리에서 릴리스를 설치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm install wp1 web-ping/
NAME: wp1
LAST DEPLOYED: Sat Jan 27 23:04:16 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 설치된 릴리스의 상태를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm ls
NAME            NAMESPACE       REVISION        UPDATED                                                             STATUS   CHART           APP VERSION
ch10-vweb       default         2               2024-01-27 22:33:30.5520121 +0900 KST                               deployed vweb-1.0.0      1.0.0
wp1             default         1               2024-01-27 23:04:16.2196499 +0900 KST                               deployed web-ping-0.1.0  1.0.0
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 차트에서 설정 가능한 값을 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm show values web-ping/      
# targetUrl - URL of the website to ping
targetUrl: blog.sixeyed.com
# httpMethod - HTTP method to use for pings
httpMethod: HEAD
# pingIntervalMilliseconds - interval between pings in ms
pingIntervalMilliseconds: 30000
# chapter where this exercise is used
kiamolChapter: ch10
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # wp2라는 이름으로 요청 대상 URL을 달리한 릴리스를 추가 배치
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm install --set targetUrl=kiamol.net wp2 web-ping/
NAME: wp2
LAST DEPLOYED: Sat Jan 27 23:40:47 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> 
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 요청을 보낼 때까지 1분 정도 기다렸다가 로그를 확인
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> kubectl logs -l app=web-ping --tail 1
Got response status: 200 at 1706366546174; duration: 738ms
Got response status: 200 at 1706366540215; duration: 109ms
```
```powershell
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 공식 헬름 리포지터리를 추가
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm repo add stable https://charts.helm.sh/stable
"stable" has been added to your repositories
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 차트뮤지엄 설치 - repo 옵션을 사용하면 리포지터리의 상세 정보를
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 받아오므로 로컬 캐시를 업데이트하지 않아도 된다
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm install --set service.type=LoadBalancer --set service.externalPort=8008 --set env.open.DISABLE_API=false repo stable/chartmuseum --version 2.13.0 --wait
NAME: repo
LAST DEPLOYED: Sun Jan 28 00:10:27 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **

Get the ChartMuseum URL by running:

** Please ensure an external IP is associated to the repo-chartmuseum service before proceeding **
** Watch the status using: kubectl get svc --namespace default -w repo-chartmuseum **

  export SERVICE_IP=$(kubectl get svc --namespace default repo-chartmuseum -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
  echo http://$SERVICE_IP:8008/

OR

  export SERVICE_HOST=$(kubectl get svc --namespace default repo-chartmuseum -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
  echo http://$SERVICE_HOST:8008/
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 로컬에 설치된 차트뮤지엄의 URL
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> kubectl get svc repo-chartmuseum -o jsonpath='http://{.status.loadBalancer.ingress[0].*}:8008'
http://localhost:8008
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10>
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> # 설치된 차트뮤지엄을 local이라는 이름으로 리포지터리 등록
PS C:\Users\hdyang\Desktop\Project\k8s-practice\ch10> helm repo add local $(kubectl get svc repo-chartmuseum -o jsonpath='http://{.status.loadBalancer.ingress[0].*}:8008')


"local" has been added to your repositories
```

## Source

- 『쿠버네티스 교과서』- 엘튼 스톤맨, 길벗  
  [https://github.com/gilbutITbook/kiamol](https://github.com/gilbutITbook/kiamol)
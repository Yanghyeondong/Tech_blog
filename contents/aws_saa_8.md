---
date: '2024-04-03'
title: 'AWS SAA 자격증 공부 < 솔루션 아키텍처 예시, Beanstalk >'
categories: ['AWS','Cloud']
summary: 'AWS SAA 취득을 위한 공부 내용을 기록합니다'
thumbnail: './aws/saa.jpg'
---

*본 포스트는 Udemy **AWS Certified SAA - Stephane Maarek** 강의를 일부 정리한 것입니다.*  
*상세한 정보는 [해당 강의](https://www.udemy.com/course/best-aws-certified-developer-associate/)를 참고하세요*


### AWS에는 좋은 아키텍처를 가진 프레임워크
- 비용  
  비용 최적화를 위한 인스턴스 예약, ASG 등
- 성능  
  수직 확장, ELB, ASG 등
- 신뢰성  
  Route53, ELB와 ASG의 다중 AZ 등
- 보안  
  로드 밸런서와 인스턴스 간의 보안 그룹
- 탁월한 운영  
  ASG등을 통한 자동화

### PoC(Proof of Concept)
새로운 프로젝트가 실제로 실현가능성이 있는지 효과와 효용, 기술적인 관점에서부터 검증을 하는 과정

## WhatIsTheTime.com
사람들에게 시간을 알려주는 앱

1. 너무 단순하기 때문에 데이터베이스가 필요 없음
2. 각각의 인스턴스와 서버는 시간이 몇 시인지 알고 있음
3. 사용자의 수를 점점 늘려가며 아키텍처 재구성
4. Stateless 무상태 형식

### V1
공용 EC2 인스턴스 t2.micro
무슨일이 생기면 재시작할 수 있도록 EC2 인스턴스 고정 IP 주소 설정  
(고정이 아니면 재시작시 IP 주소가 달라져 버린다) 따라서 탄력적 IP 연결  

### V2
점점 트래픽이 늘어나면서 부하를 처리하기 위해 수직 확장. m5.large  
탄력적 IP이기 때문에 동일한 공용 IP를 가진다.  
하지만 업그레이드 동안 다운 타임이 발생한다.  

### V3
더욱 트래픽이 증가. 수평 확장. m5.large EC2 인스턴스 추가.  
세 개의 EC2 인스턴스가 있고 세 개의 탄력적 IP가 존재.  
사용자들이 인스턴스들과 통신하려면 세 개의 탄력적 IP의 정확한 값을 알고 있어야 함.  

### V4
사용자가 점점 많은 IP를 알아야하는 문제.  
탄력적 IP 제거. 관리가 어렵고 5개가 한계.  
Route 53 활용. 웹사이트 URL : api.whatisthetime.com  
TTL이 한 시간인 A 레코드로 설정.  
사용자들이 Route 53을 쿼리하면 EC2 인스턴스들의 IP 주소들을 얻음  

### V5
상황에 따라 즉시 인스턴스 추가와 제거를 원함  
제거시 TTL 기간동안 접근이 안된다. 따라서 로드 밸런서 추가.  
공용 인스턴스가 아닌 private EC2 인스턴스를 사용한다. 같은 AZ에서.  
이에 ELB와 상태 확인을 연결. 보안 그룹 정책 활용. ELB는 공개 되지만 인스턴스는 숨겨진다.  
ELB는 지속적으로 IP주소를 바꾸기 때문에, 이를 별칭 레코드로 Route53과 연결한다.  

### V6
인스턴스를 오토스케일링 그룹(ASG)으로 실행. 요청에 따라 확장과 축소가 가능.  
다운타임 없이 오토스케일링과 로드 밸런싱이 가능하다.  

### V7
지진과 같은 재해로 인해 AZ가 다운되는 경우 가정.  
가용성을 높이기 위해 멀티 AZ를 사용한다.  
ELB가 여러 AZ로 연결되게 하고, ASG도 여러 AZ에 걸쳐있도록 한다.  

### V8
애플리케이션 비용 줄이기. 항상 돌아가는 인스턴스를 예약하여 비용 절감.  
ASG의 용량을 최소화하기. 극단적으로는 스팟 인스턴스도 가능하지만, 인스턴스가 종료될수도.  

## MyClothes.com
사람들이 온라인으로 옷을 살 수 있게 해주는 서비스  
1. Statefull 상태 유지 웹 애플리케이션
2. 장바구니가 있다 (웹 사이트를 둘러볼때 잃어버리면 안된다)
3. 동시에 수백명의 사용자 가정
4. 수평확장이 가능해야 하며, 웹 티어를 최대한 무상태로 유지
5. 사용자 정보를 DB에 저장

### V1
Route 53과 다중 AZ ELB, 오토 스케일링 그룹으로 구성. AZ는 기본적으로 3개.  
그러나 ELB가 때마다 다른 인스턴스로 연결해주면 장바구니가 사라지게 된다.  

### V2
Stickiness(Session Affinity) 고착도(세션 밀집성), 고정 세션 을 도입한다. ELB의 기능.  
하지만 인스턴스가 종료되면 장바구니를 잃어 버리게 된다.  

### V3
사용자 쿠기 사용. EC2 인스턴스가 아닌 사용자가 장바구니 내용을 저장.  
따라서 인스턴스가 이전의 일을 알 필요가 없는 Stateless 무상태 달성!  
하지만 HTTP 요청이 점점 무거워 진다. 쿠키가 공격자에 의해 변경될수도.  
이를 방지하기 위해 EC2가 쿠키의 내용을 검증한다.  
쿠키의 크기는 4KB이하만 가능해 정보의 한계도 있다.  

### V4
서버 세션 도입.
전체 장바구니를 대신에 단순히 세션 ID만 쿠키로 보낸다.  
백그라운드 ElastiCache 클러스터가 장바구니 내용을 저장하고 세션 ID로 불러온다.  
인스턴스가 달라져도 세션 ID로 ElastiCache에서 데이터를 불러온다.  
ElastiCache는 매우 빠르기 때문에 좋다. 밀리세컨드 이하.  
DynamoDB도 활용 가능.  
훨씬 더 안전하다.  

### V5
사용자 데이터 저장을 위해 RDS와 각각의 인스턴스가 통신.  
다중 AZ 무상태 솔루션 가능.  
사용자 증가에 따른 제품 정보 읽기 확장. (RDS 읽기 전용 복제본)  
캐시를 사용하는 쓰기모드. 이를 통해 RDS의 트래픽 줄이기 가능.  
캐시 유지 보수는 애플리케이션 쪽에서 이루어져야 한다.  

### V6
재해 대비. Route 53는 이미 가용성이 높다.  
로드 밸런서 ASG는 다중 AZ. RDS도 다중 AZ.  
Redis를 사용하면 ElastiCache도 다중 AZ.  
ELB는 어디에서나 HTTP HTTPS 트래픽을 열도록 보안 그룹 설정.  
인스턴스는 로드 밸런서로부터 오는 트래픽만 허용.   
RDS, ElastiCache는 보안 그룹으로 부터 오는 트래픽만 허용.  

## MyWordPress.com
완전히 확장 가능한 WordPress 웹사이트  
1. 기본적으로 모든 인스턴스들이 드라이브 데이터에 접근해야 함
2. 사용자 데이터와 블로그 내용을 MySQL에 저장

### V1
RDS 계층을 오로라 MySQL로 교체 (다중 AZ, 읽기 전용 복제본, 글로벌 데이터베이스)  
이미지 저장의 경우  
- EC2 인스턴스에 EBS 볼륨 연결, 로드 밸런서에 연결
- 확장시 문제가 발생한다. 한쪽에 있는 EBS 볼륨에만 데이터가 있는경우.

### V2
EFS(NFS)를 활용. 각 AZ에 ENI를 생성, 이를 EFS와 연결.  
스토리지가 모든 인스턴스에 공유된다!  


## 애플리케이션의 빠른 인스턴스화
### EC2
Golden AMI를 사용
- 애플리케이션과 OS 종속성 등 모든 것을 사전에 설치하고 그것으로 부터 AMI를 생성. 이후 EC2를 AMI로부터 생성.
UserData로 부트스트래핑
- 애플리케이션, OS 종속성 등을 설치하기 위해 부트스트래핑. 하지만 매우 느리다.
- Elastic Beanstalk으로 Golden AMI와 Userdata를 혼합해서 사용.
### RDS database
스냅샷으로 부터 복구.  
EBS 볼륨으로 복구가 가능하다.  

## Elastic Beanstalk
개발자 입장에서 애플리케이션을 AWS에 배포. 관리형 서비스.  
용량 프로비저닝, 로드 밸런서 설정, 스케일링, 애플리케이션 상태 모니터링, 인스턴스 설정 등을 처리.  
Go, Java SE, Java with Tomcat, .NET Core on Linux, .NET on Windows Server,   
Node.js, PHP, Python, Ruby, Packer Builder, Single Docker Container  
Multi-Docker Container, Preconfigured Docker 등 지원  

### Beanstalk 컴포넌트
애플리케이션 버전
- 애플리케이션 코드, 버전 1,2,3 등
환경
- 특정한 애플리케이션 버전을 실행하는 리소스들의 컬렉션
- 웹 서버 환경 티어, 워커 환경 티어

#### 웹 티어
로드 밸런서가 있고 그게 트래픽을 오토 스케일링 그룹에 전송하고 다수의 EC2 인스턴스가 있는 전통적인 아키텍처.

#### 워커 환경 티어
EC2 인스턴스에 직접적으로 액세스하는 클라이언트가 없다.  
메시지 대기열인 SQS Queue를 사용.  
EC2 인스턴스는 워커가 된다. 메시지를 SQS Queue에서 가져와서 처리.  
SQS 메시지의 개수에 따라 스케일링.  
웹 환경과 워커 환경을 하나로 모을 수 있다.  

### 배포 모드
싱글 인스턴스, 개발용
- 하나의 EC2 인스턴스를 가지고 탄력적 IP와 연결.
고가용성, 프로덕션 환경
- 로드 밸런서가 있어서 로드를 다수의 EC2 인스턴스에 걸쳐 분산
- 다중 AZ와 ASG, RDS 에 의해 관리

## Source

- 『AWS Certified Cloud Solutions Architect』 *Stephane Maarek - 지음*  
  [https://www.udemy.com/course/best-aws-certified-developer-associate](https://www.udemy.com/course/best-aws-certified-developer-associate/)

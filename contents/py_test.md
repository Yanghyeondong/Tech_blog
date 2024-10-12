---
date: '2024-10-13'
title: 'Python 실전 압축 정리본 [2024.10.13 보충]'
categories: ['Tip','Python', 'Algorithm']
summary: '코딩테스트에 유용한 Python 라이브러리와 문법을 정리합니다.'
thumbnail: './common/python.png'
---


*2024.03.23 - 첫 작성*  
*2024.09.29 - 그래프 관련 알고리즘 추가 보충*  
*2024.10.13 - 이분탐색, 에라토스테네스의 체, gcd, lcm, 플로이드워셜 추가*  
\
최근 알고리즘 특강때문에 C++를 오랜만에 복기했습니다.  
근데 오히려 C++를 장기간 하다보니 본래 Python이 헷갈리게 되었습니다.  
그래서 Python 정리본도 작성하였고, 다음과 같이 공유합니다.  
[파이썬 알고리즘 인터뷰](https://github.com/onlybooks/algorithm-interview) 도서를 많이 참고했습니다!.  


### 라이브러리 활용 코드

```python
import pprint       # pprint.pprint(locals()) 로컬 변수 디버깅
import re           # 정규식
import collections  # counter, defaultdict, deque ...
import sys          # -sys.maxsize, stdin.readline
import heapq        # 우선순위 큐, 힙 큐
import math         # gcd, lcm

from bisect import bisect_left, bisect_right    # 이진탐색

# 입력 시간 단축 (개행문자까지 받아오므로 주의!)
input = sys.stdin.readline
test = input()

# 가능한 메소드 출력
a = []
dir(a)
'''
...
 'pop',
 'remove',
 'reverse',
 'sort']
'''

# input
a = input()

# print
print('a','b',sep=',', end=' ') 
print('a','b',sep=',', end=' ') # a,b a,b 
a = ['a','b']
print(' '.join(a)) # a b

# f-string
print(f'{3*6} : {a}') # 18 : ['a', 'b']

# enumerate
for i, num in enumerate(nums):
	print(i,num)

# 문자열 처리
# str은 immutable 이다. + 연산시 복제 됨.
# 파이썬에 char 자료형은 없다.

s = s.lower() # 소문자로 변경
len(s)        #문자열 길이
s.isdigit()   # 숫자로만 구성?
s.isalpha()   # 알파벳으로만 구성?
s.isalnum()   # 알파벳 혹은 숫자로만 구성? 특수 문자는 안됨
s.split()     # 공백 기준으로 분리. 여러개의 공백도 가능
s==s[::-1]    # 인덱스 슬라이싱. 거꾸로 뒤집기

s = "test"
sorted(s)     # ['e', 's', 't', 't']


re.sub('[^a-z0-9]', '', s)  # s에서 a-z0-9가 아닌 한글자들을 '' 공백 문자로 바꾸기.
re.sub("[!?',;.]", " ", s)  # 특수 문자들 제거
re.sub('[^\w]', ' ', s)     # 특수 문자들 제거
re.sub('[\W]', ' ', s)      # 특수 문자들 제거

s.startswith('Hello')       # True or False
s.endswith('Hello')         # True or False

# set
my_set = {1, 2, 3, 4, 5, 1, 2}  # {1, 2, 3, 4, 5}
my_set.add(3)                   # {1, 2, 3, 4, 5}

my_list = [1, 2, 3, 4, 5, 1, 2]
unique_set = set(my_list)       # {1, 2, 3, 4, 5}


# 리스트
a = [1,4,2,3,1]
a.count(1)	# 2
a.index(1)	# 0
a.append(4)
a.pop()		  # 1
a.pop(0)	  # 1
del a[0]
a.sort()    # 반환값 없음
sorted(a)
a.reverse()
min(a)
max(a)
copy = a[:]

# 리스트 컴프리헨션
# 1부터 10까지의 n중 홀수인 수라면 2를 곱해서 리스트로 만든다
[n*2 for n in range(1,10+1) if n%2 == 1]

# 리스트는 대소 비교 가능, 순차 비교. 타입은 같아야 함. 길이가 다르면 더 긴거.
[1,2,3] < [1,2,4] # true

# 카운터
counts = collections.Counter(words)
counts_dict = dict(counts)
# 가장 많은 k개를 불러온다.
counts.most_common(k)[0][0] # 단어에 해당
counts.most_common(k)[0][1] # 횟수에 해당

# 딕셔너리
a = {}
a['a'] = 100
a['b'] = 200
'a' in a          # ture
len(a)            # 2
del a['a']

list(a.keys())    # ['a', 'b']
list(a.values())  # [100, 200]
list(a.items())   # [('a', 100), ('b', 200)]

for k,v in a.items():

# 조회와 값 할당이 동시에 가능
a = collections.defaultdict(list)
a['test'].append(word)

# 입력 순서 유지
a = collections.OrderedDict(list)

# Deque
q = collections.deque()
q.appendleft(1)
q.append(2)
q[1]            # 2
q.popleft()     # 1
q.pop()         # 2


# 나눗셈 연산자
5 / 3	# 1.6666
5 // 3	# 1
int(5/3) # 1
5 % 3	# 2

# gcd(최대공약수), lcm(최소공배수)
math.gcd(11, 22, 33)    # 11
math.lcm(2, 4, 6)       # 12

def gcd(a, b):
    while b > 0:
        a, b = b, a % b
    return a

def gcd(a, b):
    if b == 0:
        return a
    else:
        return gcd(b, a % b)

def lcm(a, b):
    return abs(a * b) // gcd(a, b)  # or math.gcd()

# 다중 할당 (우측 값들이 최초로 먼저 정해진다)
a = 1
b = 2
c = 3
d = 4
a, b, c = d, a, b # 4 1 2


# 정렬
a.sort(key=lambda x: (x[1], x[0]))  # 우선순위 설정 

# 우선순위 큐
heap = []
heapq.heappush(heap, 4)
heapq.heappush(heap, 1)
heapq.heappush(heap, 7)
heapq.heappush(heap, 3)
heapq.heappush(heap, 2)
heap                # [1, 2, 7, 4, 3]
heap[0]             # 1
heapq.heappop(heap) # 1
heap                # [2, 3, 7, 4]

heap = [4, 1, 7]
heapq.heapify(heap)

# 최대힙 구현
heapq.heappush(heap , (-item , item))

# 이진탐색

nums = [0,1,2,3,4,5,6,7,8,9]
n = 5

bisect_left(nums, n) # 5 삽입할 수 있는 가장 왼쪽 인덱스를 리턴
bisect_right(nums, n) # 6 삽입할 수 있는 가장 오른쪽 인덱스를 리턴

nums = [4, 5, 5, 5, 5, 5, 5, 5, 5, 6]
n = 5

bisect_left(nums, n) # 1
bisect_right(nums, n) # 9

# bisect_right(a) - bisect_left(b) = a~b 범위에 포함되는 데이터의 개수
# bisect_right(a) - bisect_left(a) = a 데이터의 개수
```
### 기타 알고리즘

```python
# 다익스트라 (출처 : velog.io/@tks7205)
# 단방향, 양방향, 사이클 모두 가능
# 음의 간선이 있을때는 불가능 (사이클로 인한 무한 반복)
import collections as cl
import heapq 

# 5 6
# 1
# 5 1 1
# 1 2 1
# 1 3 3
# 2 3 1
# 2 4 5
# 3 4 2

n, m = map(int, input().split())  # 노드 갯수, 간선 갯수 
k = int(input())                  # 시작 노드

graph = cl.defaultdict(list)      # 각 노드에서 갈수 있는 다음 노드와 거리 정보. 
distance = [1e8] * (n+1)          # 시작 노드에서 각 노드까지 걸리는 거리. 이후 갱신된다.

for _ in range(m):
  start, end, cost = map(int, input().split()) # start: 출발노드, end: 도착노드, cost: 연결된 간선의 가중치 
  graph[start].append((end, cost))

def dijkstra(start):
  q = []
  heapq.heappush(q, (0, start))   # k=1 에서 시작
  distance[start] = 0             # 자기 자신까지의 길이는 0

  while q:
    cost, node = heapq.heappop(q)  # start(출발노드)부터 node(현재노드) 까지의 dist(거리, 일단 시도해보는 값)
    
    # 시도 해보는 값이 이미 distance에 기록된 값보다 크다면 의미가 없음, 이전 어디선가 최솟값을 갱신.
    # 큐에 넣을때 최솟값으로 갱신하고 넣긴 하지만, 그 이전에 큐에서 빠져나온 후 계산된 값이 더 작을수도 있음. 이런 경우 생략.
    if distance[node] < cost:      
      continue

    for next_node, new_cost in graph[node]:                      # node(현재노드)로 부터 갈 수 있는 모든 노드 탐색
      if cost+new_cost < distance[next_node]:          # 새롭게 늘어난 거리가 기존에 기록된 값보다 작은 경우에만 시도해볼 가치가 있다.
        distance[next_node] = cost+new_cost            # 최솟값 갱신하기
        heapq.heappush(q, (cost+new_cost, next_node))  # 새로운 값 시도해보기

dijkstra(k)
print(distance)
```

```python
# 프림 (출처: https://c4u-rdav.tistory.com/49)
# 단방향, 사이클 모두 가능. 양방향일때, 방향에 따라 가중치가 다르면 작동하지 않는다!

import heapq

gp = cl.defaultdict(list) # 각 노드에서 갈수 있는 다음 노드와 거리 정보. 
visit = {}                # 특정 노드가 현재 생성중인 그래프에 포함되어 있는지 확인.
total_cost = 0            # 전체 간선 cost 합.


for start, end, cost in costs:
    gp[start].append((end, cost))
    gp[end].append((start, cost))

def prim(start):
    nonlocal total_cost
    q = []
    hq.heappush(q,(0, start))
    
    while q:
        cost, node = hq.heappop(q)

        if node in visit:  # 새롭게 선택한 노드의 경우. 항상 최솟값을 선택하기에 기존 값을 갱신하지는 않는다.
            continue
        
        # 그래프에 포함 처리
        visit[node] = 1
        total_cost += cost
        
        for next_node, cost in gp[node]:
            if next_node not in visit:
                hq.heappush(q,(cost, next_node))

prim(0)
```

```python
# 크루스칼 (출처: https://c4u-rdav.tistory.com/48)
# 단방향, 양방향, 사이클 모두 가능.

# 연결 cost가 작은 간선부터 그리디하게 뽑으므로 정렬
costs.sort(key = lambda x : x[2])
total_cost = 0

# 특정 노드의 부모 노드를 기록. 경로압축시 root 노드를 담게된다.
parent = {}
for i in range(n):
    parent[i] = i

def find_root(n):
    if n != parent[n]:
        parent[n] = find_root(parent[n])
        '''
        경로 압축 : 
        find_root 함수를 재귀적으로 호출한 뒤에 부모 테이블 값을 갱신하는 기법. 
        find_root 함수를 호출하면 해당 노드의 루트 노드가 바로 부모 노드가 되도록 하는 것이다. 
        이렇게 하면 다음에 더 빠르게 부모 노드에 거슬러 갈 수 있다.
        시간복잡도 N->Log(N)
        '''
        # return find_root(parent[n])
    return parent[n]
    # return n

def union(n1, n2):
    n1_root = find_root(n1)
    n2_root = find_root(n2)
    
    # 각 노드가 속한 그룹의 root를 합치면서, 그룹 전체를 합치게되는 효과가 발생한다. 단순히 n1만 바꿔서는 안됨
    if n1_root < n2_root:
        parent[n2_root] = n1_root
    else:
        parent[n1_root] = n2_root
        
def is_same_root(n1, n2):
    n1_root = find_root(n1)
    n2_root = find_root(n2)
    
    if n1_root == n2_root:
        return True
    else:
        return False

def kruskal():
    nonlocal total_cost 

    for start, end, cost in costs:
        # 두 노드가 연결되어 있지 않다면
        if not is_same_root(start, end):
            union(start, end)
            total_cost += cost
            continue

kruskal()
```

```python
# 이분탐색

def binary_search(target, data):
    data.sort()
    start = 0
    end = len(data) - 1

    while start <= end:
        mid = (start + end) // 2 

        if data[mid] == target:
            return mid

        elif data[mid] > target:
            end = mid - 1
        else:
            start = mid + 1
    return -1
```

```python
# 소수 판별
def is_prime(n):
    if n < 2: # 0과 1은 소수가 아님
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# 에라토스테네스의 체
def sieve_of_eratosthenes(limit):
    sieve = [True] * (limit + 1)
    sieve[0] = sieve[1] = False  # 0과 1은 소수가 아님
    
    for i in range(2, int(limit ** 0.5) + 1):
        if sieve[i]:
            for j in range(i * i, limit + 1, i):
                sieve[j] = False
    
    # 소수만 리스트로 반환
    return [i for i in range(limit + 1) if sieve[i]]
```

```python
# 플로이드-워셜

INF = 1e10
n = 6 # 노드 수
cost = [[1, 2, INF, 4],[2, 0, 3, 5],[3, 2, INF, 0 ],[3, 2, 1, 0]]

def FloydWarshall():
    for k in range(n): # 중간
        for i in range(n): # 시작
            for j in range(n): # 끝
                if cost[i][j] > cost[i][k] + cost[k][j]:
                    cost[i][j] = cost[i][k] + cost[k][j]

FloydWarshall()
```
## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)

- 『다익스트라 알고리즘』 *-cyr*  
  [https://velog.io/@tks7205/%EB%8B%A4%EC%9D%B5%EC%8A%A4%ED%8A%B8%EB%9D%BC-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-with-python](https://velog.io/@tks7205/%EB%8B%A4%EC%9D%B5%EC%8A%A4%ED%8A%B8%EB%9D%BC-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-with-python)
  
- 『크루스칼, 프림 알고리즘』 *-씨포유*  
  [https://c4u-rdav.tistory.com/49](https://c4u-rdav.tistory.com/49)
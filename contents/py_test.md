---
date: '2024-03-23'
title: 'Python 실전 압축 정리본'
categories: ['Tip','C++', 'Algorithm']
summary: '코딩테스트에 유용한 Python 라이브러리와 문법을 정리합니다.'
thumbnail: './common/python.png'
---

최근 알고리즘 특강때문에 C++를 오랜만에 복기했습니다.  
근데 오히려 C++를 장기간 하다보니 본래 Python이 헷갈리게 되었습니다.  
그래서 Python 정리본도 작성하였고, 다음과 같이 공유합니다.  
[파이썬 알고리즘 인터뷰](https://github.com/onlybooks/algorithm-interview) 도서를 많이 참고했습니다!.  


### 코드

```python
import pprint       # pprint.pprint(locals()) 로컬 변수 디버깅
import re           # 정규식
import collections  # counter, defaultdict, deque ...
import sys          # -sys.maxsize
import heapq

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
```

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)

---
date: '2023-12-03'
title: 'Leetcode 347번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 347번 문제 풀이,'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/description/)
\
주어진 정수 배열에서 가장 많이 등장하는 순서로 **k**개의 숫자를 찾아내는 문제입니다. 리턴하는 리스트 내의 숫자 순서는 상관없는것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 ms
```py
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counter = Counter(nums)
        counter = sorted(counter.items(), key = lambda x: x[1], reverse=True)
        print(counter)
        ans = []
        for i in range(k):
            ans.append(counter[i][0])

        return ans
```
\
**코드 2** (개선)  
처리시간 ms
```py
class Solution:
    def topKFrequent(self, nums, k):
        return list(zip(*collections.Counter(nums).most_common(k)))[0]
```

## 3. 피드백
이번 문제는 굉장히 간단하기에 생략할까 했지만, **파이써닉**한 방법이 눈에 띄어 글을 작성합니다.  
\
**코드 1**과 **코드 2**의 차이점을 짚어보면 다음과 같습니다.

- `sorted()` vs `most_common()`
- `append()` vs `zip(*)`

**코드 1**에서는 가장 많이 등장하는 숫자 순서를 구하기 위해 `sorted()` 정렬을 사용하지만, **코드 2**는 `Counter`가 자체적으로 지원하는 `most_common()` 을 사용합니다. 두말할 것도 없이 후자가 더 직관적이고 간단합니다.  
\
**코드 1**은 정렬된 숫자들을 순회하며 **k**번째까지 숫자를 구하지만 **코드 2**는 `zip(*)`을 사용합니다.  
`*`은 **언패킹**을 의미하며, 기존의 `most_common()` 리턴 튜플을 언패킹 하면  
`(number 1, appearances 1), (number 2, appearances 2) ...` 형태가  
`[number 1, appearances 1], [number 2, appearances 2] ...` 같은 형태로 됩니다.  
이것을 다시 `zip`으로 묶으면  
`(number 1, number 2), (appearances 1, appearances 2) ...` 가 됩니다.  


## 4. 요약정리
`Counter` 는 `.most_common()` 함수를 지원한다.  
`zip()`은 여러 리스트를 각 쌍마다 묶어준다.  
`*`는 튜플을 풀어주는 역할을 한다.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/top-k-frequent-elements/description/](https://leetcode.com/problems/top-k-frequent-elements/description/)
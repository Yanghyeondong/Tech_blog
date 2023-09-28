---
date: '2023-09-28'
title: 'Leetcode 46번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 46번 순열 문제 풀이, itertools'
thumbnail: './common/leetcode_3.png'
---
## 1. 문제 확인

[46. Permutations](https://leetcode.com/problems/permutations/)
\
주어진 리스트의 원소들로 만들 수 있는 **순열**을 계산하는 문제입니다.  
워낙 간단한 문제라 넘어갈까 하다가, 코딩 인터뷰등에서 `itertools.permutations()`같은 모듈을 어떻게 설명하는 게 좋은지 잘 정리되어 있어 작성합니다.  

## 2. 코드

**코드 1**  
처리시간 49ms
```py
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        max_len = len(nums)
        nums.append('root')
        ans = []

        def _rec(depth: int, k, last_li: list, used_li: list):
            last_li.remove(k)
            used_li.append(k)

            if depth >= max_len:
                ans.append(used_li[1:])

            for i in last_li:
                _rec(depth+1, i, last_li[:], used_li[:])

        _rec(0, 'root', nums, [])
        
        return ans
```
\
**코드 2** (개선)  
처리시간 41ms
```py
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        return list(itertools.permutations(nums))
```

## 3. 피드백
우선 **코드 1**의 경우 **DFS**를 활용하여 각 원소의 순열을 누적시켜서 풀어나갑니다.  
주요 아이디어는 다음과 같습니다.  

1. 아직 사용하지 않은 숫자 리스트에서 숫자 k 하나를 뽑는다.  
2. 사용하지 않은 숫자 리스트에서 k 를 제거한다.  
3. 사용한 숫자 리스트에 k 를 더한다.  
4. 사용하지 않은 숫자 리스트의 모든 숫자에 대해서 k 로써 함수를 다시 호출한다.
5. 길이가 최초 숫자 리스트와 동일해질 경우 return 한다.  
\
**코드 1**은 최대한 직관적이고 이해하기 쉽게 구성하려고 노력했으며, 이 때문에 `depth, k, last_li, used_li` 등 여러 파라미터가 많아졌습니다. 이들은 충분히 줄이거나 대체 가능합니다.  
\
`depth`의 경우 `len(used_li)`로 대체가 가능합니다. `used_li`의 경우 굳이 복제해서 전달하지 않고 다음과 같이 글로벌로 사용이 가능합니다.  

```py
max_len = len(nums)
nums.append('root')
used_li = []
ans = []

def _rec(depth: int, k, last_li: list):
    last_li.remove(k)

    if depth >= max_len:
        ans.append(used_li[:])

    for i in last_li:
        used_li.append(i)
        _rec(depth+1, i, last_li[:])
        used_li.pop()

_rec(0, 'root', nums)

return ans
```
\
**코드 2**의 경우 `itertools.permutations()`을 활용해 너무나도 간단히 문제를 풀이합니다.  
리턴값이 튜플이라 `list()`가 필요하긴 하지만, 여전히 한 줄로 풀이가 가능합니다.  
\
책에서는 코딩 테스트, 인터뷰 시 이 같은 풀이 설명을 다음과 같이 추천합니다.  
\
**온라인 테스트**의 경우
- 해당 모듈이나 라이브러리를 적극 사용.  
- 주석으로 **구현의 효율성, 성능, 안정성**등을 위해 사용하였다 를 써주면 좋다.  

**대면 면접**의 경우
- 라이브러리나 모듈이 아닌 직접 풀어보라 질문받을 수도 있다.  
- 이런 라이브러리가 있고, 지금은 알고리즘 풀이 중이라 사용하지 않지만,  
  실무에서는 여러 이점으로 인해 사용하지 않을 이유가 없다고 어필.  

## 4. 요약정리

**순열** 문제는 `itertools.permutations()`로 쉽게 풀이가 가능하다.  
라이브러리 사용 시, 장점(**구현의 효율성, 성능, 안정성**)을 잘 설명하자. 안 쓰더라도 어필가능!

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/permutations/](https://leetcode.com/problems/permutations/)
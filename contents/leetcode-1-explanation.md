---
date: '2022-09-08'
title: 'Leetcode 1번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 1번 두 수의 합 문제 풀이, 딕셔너리 자료형과 in() 함수'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[1. Two Sum](https://leetcode.com/problems/two-sum/submissions/)
\
리트코드의 첫 번째 문제입니다. **두 수의 합**이 주어진 수가 되는 걸 찾으면 됩니다.  
간단한 문제지만 풀이가 다양하여 정리해보았습니다.

## 2. 코드

**코드 1**  
처리시간 78ms
```py
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_dic = collections.defaultdict(list)
        
        for indexes, num in enumerate(nums):
            num_dic[num].append(indexes)
            
        for num, indexes in num_dic.items():
            if target - num in num_dic:
                if target - num == num:
                    if len(num_dic[num]) > 1:
                        return num_dic[num]
                else:
                    return [indexes[0], num_dic[target - num][0]]
```
\
**코드 2 (개선)**  
처리시간 44ms
```py
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        nums_map = {}

        for i, num in enumerate(nums):
            if target - num in nums_map:
                return [nums_map[target - num], i]
            nums_map[num] = i
```

## 3. 피드백
우선 책 『파이썬 알고리즘 인터뷰』에는 다음과 같은 방법이 소개되어 있습니다.
> 1. 브루트 포스  
> 2. `in` 연산 사용
> 3. 딕셔너리 사용
이중 제가 사용한 방법은 가장 빠른 **3. 딕셔너리**입니다. 다만, 개선의 여지가 많았습니다.  
우선, 딕셔너리를 다 만들고 이를 다시 조회하는 방식에 단점이 있습니다. 반복문으로 숫자를 찾을 때 값만 같은 서로 다른 수를 조회한 건지, 아니면 동일한 수를 두 번 조회한 건지 구분해야 합니다.  
- ex.) `nums: [3,3] target: 6` ➜ `if target - num == num:`  
이때 딕셔너리를 먼저 조회하고 없으면 입력하는 방식으로 바꾸면 동일한 숫자를 두 번 조회할 일이 없으므로 훨씬 코드가 간결해집니다(**코드 2**에 해당). 또한, 이번 문제는 최대 2개의 동일한 값이 나오기 때문에 동일한 키값을 넣으면 최신 값으로 바뀐다는 딕셔너리의 특징을 사용해도 숫자를 2번 조회할 일이 없습니다.  
\
나머지 방법 중 **1. 브루트 포스**는 셀렉션 소트처럼 이중 반복문으로 하나씩 수를 비교하는 방법입니다. **2. `in` 연산 사용**의 경우 조금 특이합니다. 시간 복잡도 상으로는 O(n^2)으로 1번과 다를 바가 없지만, 파이썬 내부 함수 `in`은 직접 비교보다 훨씬 빠르기 때문에 눈에 띄게 차이가 난다고 합니다.

### 추가팁!
파이썬에서는 반복문을 쓸 때 `enumerate()`를 쓰는 것이 파이썬다운 방식으로 바람직합니다.  
`for i in range(0, len(nums)):` ➜ `for i, num in enumerate(nums):`

## 4. 요약정리
특정 값을 찾아야 하는 문제에서는 **딕셔너리** 자료형을 통해 O(1)로 조회하는 것을 먼저 생각해보자.
리스트의 `in()` 연산은 직접 코드상으로 일일이 비교하는 것보다 훨씬 빠르다.

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/)
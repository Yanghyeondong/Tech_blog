---
date: '2022-09-13'
title: 'Leetcode 561번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 561번 배열 파티션 문제 풀이 1, 리스트 슬라이싱'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[561. Array Partition](https://leetcode.com/problems/array-partition/)
\
n개의 짝에 `min()`함수를 적용한 후 합의 최댓값을 구하는 문제입니다. 얼핏 보면 어려워 보이지만 쉬운 문제입니다. 주어지는 배열(파이썬은 리스트)의 원소 개수는 2n으로 짝수인 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 763ms
```py
class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        nums.sort()
        sum = 0
        i = 0
        
        while i < len(nums):
            sum += nums[i]
            i += 2

        return sum
```
\
**코드 2 (개선)**  
처리시간 342ms
```py
class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        return sum(sorted(nums)[::2])
```

## 3. 피드백
**코드 2**는 단 한 줄로 문제를 해결합니다. 시간 복잡도는 두 코드 모두 O(n)으로 차이가 없습니다.  
\
해당 문제의 기본 아이디어는 `sort()`입니다. 주어진 숫자들의 리스트를 정렬하게 되면 `min()` 에 들어가는 짝을 만들기 쉬워집니다. 저희의 목적은 `min()` 합의 최댓값을 구하는 것입니다. 간단히 생각하면 2개의 숫자 중 **큰 수**는 버려지고 **작은 수**만 남는데, 여기서 **작은 수**의 합이 최대가 돼야 합니다.   
\
즉, 짝을 정할 때 큰 수와 작은 수의 차이가 작을수록 낭비되는 수가 없는 것입니다. 따라서 정렬된 상태에서 2개씩 순차적으로 숫자를 끊어주게 되면 최대한 작은 수의 합을 크게 만들 수 있습니다. ex.) `[n, n+2, n+5, n+14]` ➜ n+(n+5)가 가장 큰 수  
\
추가적으로 **코드 2**의 경우 위의 원리를 반복문이 아닌 `sum()` 과 리스트 슬라이싱을 통해 구현했습니다. 따라서 속도가 비교적 빠르다고 볼 수 있습니다.

## 4. 요약정리

`min()` 합의 최댓값은 `sort()`를 응용해서 파티션을 만들자.  
리스트 슬라이싱을 통해 홀수나 짝수 인덱스 값만 불러올 수 있다. `list[start:end:step]`

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/array-partition/](https://leetcode.com/problems/array-partition/)
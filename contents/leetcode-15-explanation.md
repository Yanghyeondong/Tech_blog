---
date: '2022-10-02'
title: 'Leetcode 15번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 15번 문제 풀이, 시간 복잡도 O(n^2) 투 포인터 방식'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[15. 3Sum](https://leetcode.com/problems/3sum/)
\
지난번에 풀었던 [1. Two Sum](https://hyeondong.com/leetcode-1-explanation/) 문제의 진화 버전입니다. 이번에는 **3**개 숫자의 합이**0**이 되는 조합을 찾는 것입니다. 조합 내부의 순서는 상관없지만 중복되는 조합이 있어서는 안되는 것이 포인트입니다.
## 2. 코드

**코드 1**  
처리시간 5884 ms
```py
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        ans = []
        nums_map = {}

        for i, num_1 in enumerate(nums):
            for j in range(i+1, len(nums)):
                if 0 - nums[i] - nums[j] in nums_map:
                    tmp_ans = [nums[i], nums[j], 0 - nums[i] - nums[j]]
                    tmp_ans.sort()
                    if tmp_ans not in ans:
                        ans.append(tmp_ans)
            nums_map[num_1] = 0

        return ans
```
\
**코드 2 (개선)**  
처리시간 793 ms
```py
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        results = []
        nums.sort()

        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue

            left, right = i + 1, len(nums) - 1
            while left < right:
                sum = nums[i] + nums[left] + nums[right]
                if sum < 0:
                    left += 1
                elif sum > 0:
                    right -= 1
                else:
                    results.append([nums[i], nums[left], nums[right]])

                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1

        return results
```

## 3. 피드백
이번에도 **코드 2**의 시간이 훨씬 더 짧습니다. **코드 1**의 경우 절반 정도는 Time Limit Exceeded 가 떴기 때문에 바람직하지 못한 풀이라고 봅니다.  
\
**코드 1**의 경우 저번에 풀었던 [1. Two Sum](https://hyeondong.com/leetcode-1-explanation/) 문제의 풀이를 응용했습니다. 다만 차이점이 다음과 같이 있습니다.  
> 1. 숫자가 3개이기 때문에 **이중 반복문**으로 2개의 수를 선택해야 한다. **ex.) x = 0 - 1 + 2**  
> 2. 총 3개의 숫자 리스트를 만들기 때문에 **중복**이 일어난다. **ex.) [1, 0, -1], [0, 1, -1]**

일단 1번으로 인해서 **O(n^2)** 시간 복잡도는 확정이 됩니다. 하지만 **코드 2**의 풀이도 **O(n^2)** 인데 왜 시간 차이가 나는 걸까요? `tmp_ans.sort()` 의 경우 최대 3개의 숫자를 소팅하기 때문에 시간 복잡도에 영향을 주지는 않습니다. 하지만 `if tmp_ans not in ans:` 에서 최악의 경우 **O(n)** 을 소비하기 때문에 전체 시간 복잡도가 **O(n^3)** 이 되어버립니다.  
\
**코드 2**는 이러한 문제점을 해결하기 위해 투 포인터를 사용합니다. 해당 방법은 중복을 쉽게 제거함과 동시에 **O(n^2)** 으로 풀이가 가능합니다. 기본적인 아이디어는 다음과 같습니다.
> 1. 주어진 리스트를 `sort()` 한다.  
> 2. 순차적으로 숫자를 하나 선택한다.  
> 3. 그 숫자의 오른쪽에 있는 숫자 범위 내에서 **이중 포인터** (left, right)를 둔다.  
> 4. 각 포인터와 선택한 숫자의 합이 0이 되는지 확인한다.
> 5. 결과에 따라 이중 포인터를 좌우로 움직인다.

여기서 중복을 처리하는 부분은 다음과 같습니다. `if i > 0 and nums[i] == nums[i - 1]:` 의 경우 위의 아이디어 중 **2번**에 해당하는 동일한 숫자에 대해 재확인을 방지합니다. `sort()` 되어 있기 때문에 가능합니다. `while left < right and nums[left] == nums[left + 1]:` 도 비슷한 맥락으로 **3번**에 해당하는 동일한 숫자에 대해 재확인을 방지합니다.
## 4. 요약정리

숫자들의 사칙연산 문제의 경우 **투 포인터**와 `sort()` 함수를 응용해보자.  
단, O(n) 이하로 푸는 게 불가능할 때만.

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/3sum/](https://leetcode.com/problems/3sum/)
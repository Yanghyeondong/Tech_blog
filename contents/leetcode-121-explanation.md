---
date: '2022-12-30'
title: 'Leetcode 121번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 121번 주식을 사고팔기 가장 좋은 시점 문제 풀이, 시간 복잡도 O(n)'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
\
시간에 따른 주식 값이 주어지고, 가능한 **최대 이익(차익)** 을 구하는 문제입니다. 차익의 값만 구하면 되는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 2210 ms
```py
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        left_min = prices[0]
        right_max = prices[len(prices)-1]
        left_mins = []
        right_maxs = []
        prices_len = len(prices)

        for i in range(0, prices_len):
            left_min = min(left_min, prices[i])
            left_mins.append(left_min)
            
        for j in range(prices_len -1, -1, -1):
            right_max = max(right_max, prices[j])
            right_maxs.append(right_max)

        right_maxs.reverse()

        sub_max = -1
        for i in range(0, prices_len):
            sub_max = max(sub_max, right_maxs[i] - left_mins[i])
        if sub_max < 0:
            return 0
        return sub_max
```
\
**코드 2 (개선)**  
처리시간 2140 ms
```py
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        profit = 0
        min_price = sys.maxsize

        for price in prices:
            min_price = min(min_price, price)
            profit = max(profit, price - min_price)

        return profit
```

## 3. 피드백

이번에는 **코드 1**과 **코드 2**의 시간 차이가 크지 않습니다. 둘 다 **O(n)** 시간 복잡도를 가집니다.  
\
우선 **코드 1**의 경우 저번 문제 [238. Product of Array Except Self](https://yangdongs.web.app/leetcode-238-explanation/) 의 아이디어를 사용했습니다. 주요 아이디어를 정리해보면 다음과 같습니다.
> 1. 좌측 최솟값(저점)을 인덱스마다 리스트로 기록  
> 2. 우측 최댓값(고점)을 인덱스마다 리스트로 기록  
> 3. 동일한 인덱스에 한해 차이가 가장 큰 값이 최대 이익  
좌측 최솟값, 우측 최댓값을 기록한 이유는 시간상으로 **저점**이 **고점**보다 앞서야 하기 때문입니다. 즉, 좌측 최솟값을 기록하면 특정 인덱스 기준 **가장 저점인 과거 값**을 알 수가 있습니다. 반대로 우측 최댓값은 특정 인덱스 기준 **가장 고점인 미래 값**을 알 수가 있습니다. 이를 인덱스마다 확인해보면 최대 이익을 알 수가 있습니다. 예를 들어보면 다음과 같습니다.  
\
`[7, 1, 5, 3, 6, 4]` ➜ `prices`  
`[7, 1, 1, 1, 1, 1]` ➜ `left_mins`  
`[7, 6, 6, 6, 6, 4]` ➜ `right_max`  
\
위의 예시에서 다시 한번 리스트를 순회하며 `left_mins` 와 `right_max` 의 차이를 계산했을 때 답은 최댓값인 5가 됩니다. 해당 알고리즘은 전체적으로 시간 복잡도 **O(n)** 이 됩니다.  
\
**코드 2**의 경우 매번 마다 마지막 저점 기준 고점과의 차익을 갱신하여 문제를 풉니다. 주요 아이디어를 정리해보면 다음과 같습니다.  
> 1. 좌측 최솟값(저점)을 기억 
> 2. 인덱스를 순회하며 저점을 갱신
> 3. 현재 지점 기준 저점과의 차익을 구함. 최대 이익 갱신
> 4. 리스트 끝까지 반복
간단히 요약하면, 새로 저점이 갱신될 때마다 해당 저점을 기준으로 최대 이익을 구하고, 구간별 최대 이익중에서도 최댓값을 찾는 것입니다. **코드 1**과 방식이 거의 유사합니다. 차이점이 있다면 **코드 1**은 미리 전부 구해놓고 추후에 비교하는 것, **코드 2**는 실시간으로 비교하는 것입니다.  
\
**코드 2**에서 특이한 부분이라면 `min_price = sys.maxsize`를 꼽을 수 있습니다. 해당 코드를 쓴 이유는 다음 예시로 설명할 수 있습니다.  
\
`[100100, 150000, 120000, 180000, 190000, 200000]` ➜ `prices`  
`9999` ➜ `min_price`  
\
위의 경우 최솟값을 임의로 높은 값을 설정했지만 실제로는 `prices` 모든 값이 `min_price` 보다 큽니다. 따라서 `min()` 함수를 반복해도 존재하지 않는 값인 `9999`가 답이 되어 버립니다. 이때 `sys.maxsize` 값을 할당하면 파이썬에서 가능한 큰 값이 할당되므로 안전합니다.  
\
**코드 1**의 경우 이를 생각하지 않고 단순히 **첫 번째 리스트 값**을 최솟값으로 할당했습니다. 이런 경우 존재하지 않는 값이 도출될 일은 없지만 코드가 좀 복잡해지거나 반복문에서 첫 번째 요소를 무의미하게 반복하는 단점이 존재합니다. 여기서는 본인이 생각하기에 편한 값으로 설정하면 될 것 같습니다.  
\
위의 맥락과 비슷하게 **코드 1**에선 `sub_max = -1` 로 범위를 설정했는데, 이는 문제에서 이익을 보지 못하면 0으로 설정하는 조건이 있었기 때문입니다. 만약 음수도 가능했다면 이것도 첫 차익 `right_maxs[0] - left_mins[0]` 로 정하거나 `-sys.maxsize`로 설정했어야 합니다.

## 4. 요약정리

문제를 그림으로 **도식화** 하면 풀이 아이디어나 직관이 쉽게 떠오른다.  
시간에 따른 차익 문제에서는 최소 최댓값 **기록 후** 차익 계산, 혹은 **동시 갱신** 풀이가 가능하다.  
최소나 최댓값을 설정할 때는 **첫 번째 인자**를 주거나 `sys.maxsize`를 사용하자.

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/best-time-to-buy-and-sell-stock/](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
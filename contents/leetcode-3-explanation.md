---
date: '2022-12-12'
title: 'Leetcode 3번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 3번 중복 없는 가장 긴 문자열 문제 풀이, 투포인터'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)
\
주어진 문자열에서 **중복되는 문자가 없는** 가장 긴 부분 문자열을 찾는 문제입니다. **substring**, 즉 주어진 문자열에서 끊김이 없는 문자열을 찾는 것이 포인트입니다. 

## 2. 코드

**코드 1**  
처리시간 146ms
```py
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        dict = {}
        max_len = left = right = 0

        while right < len(s):
            left_c, right_c = s[left], s[right]

            if right_c in dict and dict[right_c] >= left:
                left = dict[right_c] + 1

            dict[right_c] = right
            max_len = max(max_len, right-left+1)
            right += 1

        return max_len
```
\
**코드 2** (개선)  
처리시간 122ms
```py
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        used = {}
        max_length = start = 0
        for index, char in enumerate(s):
            if char in used and start <= used[char]:
                start = used[char] + 1
            else:
                max_length = max(max_length, index - start + 1)

            used[char] = index

        return max_length
```

## 3. 피드백
이번 문제는 풀면서 책의 힌트(**투 포인터** 활용)를 살짝 봤습니다 😭. 그래서 **코드 1**과 **코드 2**의 핵심 아이디어는 동일합니다. 세부적으로 조금의 차이는 있지만, 처리시간을 포함해 대부분이 비슷합니다.  
\
주요 아이디어는 다음과 같습니다.  
1. 슬라이딩 윈도우를 위한 투 포인터 `left`, `right`를 준비한다.  
2. `right`를 한 칸씩 늘려가며 최대 길이를 갱신한다.  
3. `right`에 해당하는 문자는 항상 딕셔너리에 저장, 갱신한다.
4. 만약 `right` 문자가 이미 존재한다면 중복이므로, 이전 인덱스+1 로 `left`를 갱신한다.  
5. 이때, 인덱스+1 의 값이 `left`보다 작으면 안 된다. (되돌아가는 과정에서 중복 발생 가능)  
\
**코드 2**에서는 `for` 문을 통해 `right` 대신 `char`를,  `left` 대신 `start`를 사용합니다.  
\
위의 아이디어를 이용하면, 중복 없이 슬라이딩 윈도우를 유지하며 최댓값 갱신이 가능합니다. 예를 들어 `cabcd`의 경우, 다음과 같은 과정을 거칩니다.  

```py
left: (0, 'c') right: (0, 'c') max: 1
left: (0, 'c') right: (1, 'a') max: 2
left: (0, 'c') right: (2, 'b') max: 3
left: (1, 'a') right: (3, 'c') max: 3
left: (1, 'a') right: (4, 'd') max: 4
```
3번째 `c`에서 0번째 `c`를 확인한 순간 `left`가 `a`로 넘어가는 것을 확인할 수 있습니다.  
\
위의 아이디어 설명중 5번은 다음과 같은 예시 때문에 존재합니다.  
`abccccbd`  
6번째 `b`를 `right`로 탐색할 때, 딕셔너리 중 기존 0번째 `b`가 존재합니다. 이때 0번째 `b` 다음인 `c`를 바로 불러오게 되면 그사이에 `cccc`로 인해 제외시켰던 중복이 다시 생기게 됩니다. 따라서 `dict[right_c] >= left` 같은 조건이 필요합니다.

## 4. 요약정리
**슬라이딩 윈도우**와 **투 포인터**를 활용하자.  
딕셔너리를 통해 **O(1)** 로 문자 사용 여부에 접근하자.
## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/longest-substring-without-repeating-characters/description/](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)
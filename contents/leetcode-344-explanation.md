---
date: '2022-08-22'
title: 'Leetcode 344번 풀이'
categories: ['algorithm','leetcode']
summary: 'Leetcode 344번 문자열 뒤집기 문제 풀이, 파이썬다운 방식'
thumbnail: './common/leetcode.png'
---
이번 문제는 너무 간단한 문제라서 포스팅하지 않으려 했지만, **파이썬다운 방식**이 인상 깊어 글을 작성하게 되었습니다.

## 1. 문제 확인

[344. Reverse String](https://leetcode.com/problems/reverse-string/)
\
간단한 **문자열 뒤집기** 문제입니다. return 값을 반환하는 것이 아닌 주어진 배열 자체를 바꾸는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 413ms
```py
class Solution:
    def reverseString(self, s: List[str]) -> None:
        idx_1 = 0
        idx_2 = len(s) - 1

        for char in s:
            if idx_1 > idx_2:
                return
            
            swap_mem = s[idx_2]
            s[idx_2] = s[idx_1]
            s[idx_1] = swap_mem


            idx_1 += 1
            idx_2 -= 1
```
\
**코드 2 (개선)**  
처리시간 203ms
```py
class Solution:
    def reverseString(self, s: List[str]) -> None:
        s.reverse()
```

## 3. 피드백

문자열 뒤집기의 경우 C++ 등 다른 언어에서 투 포인터를 활용해 아주 쉽게 구현이 가능한 문제입니다. 처음에는 너무 간단한 문제라 넘어가려 했지만, 단 한 줄로 문제를 해결하는 "파이썬다운 방식"이 인상 깊어 글을 남기게 되었습니다. 물론 성능(시간) 또한 챙기면서 말이죠.  
\
코딩 테스트에서, 혹은 실제 개발환경에서라도 파이썬을 활용한다면 항상 파이썬이 본래 가지고 있는 기능을 통해 문제를 가장 간편하면서도 효과적으로 해결해나가는 관점이 꼭 필요하다고 느꼈습니다.


## 4. 요약정리

파이썬을 사용한다면 파이썬이 기본으로 가진 강력한 기능들을 충분히 활용하는 **파이썬다운 방식**을 잊지 말자.

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/valid-palindrome/description/](https://leetcode.com/problems/valid-palindrome/description/)
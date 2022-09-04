---
date: '2022-09-04'
title: 'Leetcode 5번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 5번 가장 긴 팰린드롬 부분 문자열 문제 풀이, 투 포인터와 중앙 확장'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
\
문자열 속에서 가장 긴 **팰린드롬**을 찾아내는 문제입니다. 최대 길이가 동일하다면 그중 아무 팰린드롬이나 리턴하면 되는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 645ms
```py
class Solution:
    def longestPalindrome(self, s: str) -> str:

        char_list = list(s)
        max_palindrome_len = 1
        max_palindrome_front_index = 0

        char_list_len = len(char_list)

        def find_palindrome(palindrome_len, index_front, index_end):

            is_palindrome = True
            nonlocal max_palindrome_len
            nonlocal max_palindrome_front_index
            nonlocal char_list

            while (index_front >= 0) and (index_end <= char_list_len-1) \ 
                    and is_palindrome:
                if char_list[index_front] == char_list[index_end]:
                    palindrome_len += 2
                    index_front -= 1
                    index_end += 1
                else:
                    is_palindrome = False

            if max_palindrome_len < palindrome_len:
                max_palindrome_len = palindrome_len
                max_palindrome_front_index = index_front + 1

        for center_index in range(0, char_list_len):

            find_palindrome(0, center_index, center_index + 1)
            find_palindrome(1, center_index - 1, center_index + 1)
            center_index += 1

        ans = "".join(char_list[max_palindrome_front_index : 
                max_palindrome_front_index + max_palindrome_len])
        return ans
```
\
**코드 2 (개선)**  
처리시간 100ms
```py
class Solution:
    def longestPalindrome(self, s: str) -> str:
        
        def expand(left: int, right: int) -> str:
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return s[left+1:right]
        
        if len(s) < 2 or s == s[::-1]:
            return s

        result = ''

        for i in range(len(s)-1):
            result = max(result, expand(i,i+1), expand(i,i+2), key=len)

        return result
```

## 3. 피드백

이번에는 **코드 1**과 **코드 2**의 길이 차이가 2배 넘게 납니다. 시간은 더 많이 차이가 납니다. 아직 갈길이 멀어 보입니다.  
\
두 코드의 비슷한 점, 다른 점 등을 정리해보면 다음과 같습니다.
 
>1. 둘 다 **중첩 함수**를 사용했다.  
>2. 둘 다 **투 포인터**의 **중앙 확장** 풀이를 사용했다.
>3. 코드 2는 `max()`함수를 통해 최댓값을 구했다. 
>4. 코드 2는 문자열 길이가 1인 경우, 전체가 팰린드롬인 경우 예외를 두었다. 

1번의 경우 **짝수** 팰린드롬과 **홀수** 팰린드롬에 대해서 투 포인터의 위치만 다른 알고리즘을 사용하기 때문에 공통 함수를 만들었습니다. 이는 코드의 재활용성에 도움이 됩니다.  
\
2번은 필자의 경우 다이내믹이 더 좋지 않을까 생각 했지만 구현하지는 못했는데, 책에 따르면 다이내믹보다 이 방법이 더 직관적이고 빠르다고 합니다.  
\
3번, 4번은 전반적으로 코드 2를 더 빠르게 만든 요인으로 생각됩니다. `max()`함수도 `sort()` 함수처럼 `key=len`을 지원하는걸 이번 기회에 알게 되었습니다. 또한, 굳이 `nonlocal` 변수를 만들지 않아도 된다는 점에서도 유리합니다. `len(s) < 2 or s == s[::-1]` 부분의 경우 필터링을 통해 몇몇 테스트 케이스를 빠르게 넘길 수 있다는 점이 유리하다고 생각됩니다.  
\
추가적으로 코드를 조금 더 깔끔하게 만들 수 있는 부분은 다음과 같습니다.
```py
while (index_front >= 0) and (index_end <= char_list_len-1) \ 
        and is_palindrome:
    if char_list[index_front] == char_list[index_end]:
        palindrome_len += 2
        index_front -= 1
        index_end += 1
    else:
        is_palindrome = False
```
```py
while (index_front >= 0) and (index_end <= char_list_len-1) \ 
        and char_list[index_front] == char_list[index_end]:
    palindrome_len += 2
    index_front -= 1
    index_end += 1
```
## 4. 요약정리

부분 팰린드롬을 찾는 데는  **투 포인터**의 **중앙 확장** 풀이가 다이내믹보다 유리하다.  
`max()`함수도 `key=len`을 지원한다.  
**필터링**을 통해 몇몇 케이스의 풀이 속도를 향상하자.(성능에 크게 영향을 미치지 않는 조건에서)

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/longest-palindromic-substring/](https://leetcode.com/problems/longest-palindromic-substring/)
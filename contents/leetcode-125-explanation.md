---
date: '2022-08-16'
title: 'Leetcode 125번 풀이'
categories: ['algorithm','leetcode']
summary: 'Gatsby Disqus 설치, 설정 및 url, identifier, title 인수에 대해서 알아본다'
thumbnail: './leetcode.png'
---
앞으로 leetcode 문제 풀이를 블로그에 기록할 계획입니다.
문제의 목록은 도서 "파이썬 알고리즘 인터뷰"에서 가져왔으며, 
풀이 코드와 함께 다시 한번 생각해 볼만한 점등을 정리해놓을 예정입니다.

## 1. 문제 확인

[125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/)
\
간단한 **Palindrome(회문)** 확인 문제입니다. 전처리 조건은 다음과 같습니다.
1. 대문자 모두 소문자로 변환  
2. 공백 제거  

## 2. 코드

**코드 1**  
처리시간 1800s
```py
def isPalindrome(self, s):

    # del_upper
    s = s.lower()

    # leave only alpha, number
    temp_s = ''
    for c in s:
        # same as c.isalnum()
        if c.isdigit() or c.isalpha():
            temp_s += c
    s = temp_s

    # check palindrome
    front_idx = 0
    end_idx = len(s)-1
    is_palindrome = True

    while front_idx < end_idx:
        if s[front_idx] != s[end_idx]:
            is_palindrome = False
            break
        front_idx += 1
        end_idx -= 1

    return is_palindrome
```
\
**코드 2 (개선)**  
처리시간 80s
```py
def isPalindrome(self, s):

    # del_upper
    s = s.lower()

    # leave only alpha, number
    temp_s = []
    for c in s:
        # same as c.isalnum()
        if c.isdigit() or c.isalpha():
            temp_s.append(c)
    s = temp_s

    # check palindrome
    front_idx = 0
    end_idx = len(s)-1
    is_palindrome = True

    while front_idx < end_idx:
        if s[front_idx] != s[end_idx]:
            is_palindrome = False
            break
        front_idx += 1
        end_idx -= 1

    return is_palindrome
```

## 3. 피드백

코드 1번으로는 리트코드 평균 대비 너무 늦은 속도밖에 나오지 않았습니다. 원인은 문자열을 += 연산자로 붙이는 과정 `temp_s += c` 에서 많은 시간을 소요한 것이었습니다. 파이썬의 경우 str은 immutable 이기 때문에 해당 연산자를 쓰면 매 순간마다 새로운 문자열을 생산해냅니다.
이를 배열로 고친 코드 2번의 경우 속도가 향상됐음을 알 수 있습니다.  
\
인터뷰 도서에서는 정규식 `re.sub('[^a-z0-9]', '', s)` 이나 `s==s[::-1]` 방식의 슬라이싱을 추천했으며, 이는 문자열임에도 더 빠르게 작동합니다.

### 추가팁!
반복문에서 ```for char in string``` 을 하더라도 char의 type은 str입니다. 파이썬은 char 자료형이 없습니다.

## 4. 요약정리

회문 확인 전처리 문자열을 만들 때는 문자열 자체 연산(ex. +=)이 아닌 **배열**이나 **정규식 슬라이싱**을 사용하자 *(속도 향상)*.

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/valid-palindrome/description/](https://leetcode.com/problems/valid-palindrome/description/)
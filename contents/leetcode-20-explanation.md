---
date: '2022-12-28'
title: 'Leetcode 20번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 20번 유효한 괄호 문제 풀이, 딕셔너리, 스택'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
\
괄호로 이루어진 문자열이 올바른지 확인하는 문제입니다. 가능한 괄호의 종류는 `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`입니다. "올바르다"의 기준은 다음과 같습니다.  
> **leetcode 설명**
> 1. Open brackets must be closed by the same type of brackets.
> 2. Open brackets must be closed in the correct order.
> 3. Every close bracket has a corresponding open bracket of the same type.

## 2. 코드

**코드 1**  
처리시간 44ms
```py
class Solution:
    def isValid(self, s: str) -> bool:
        c_list = list(s)
        stack: list = []

        for c in c_list:
            if c == '(' or c == '{' or c =='[':
                stack.append(c)
            elif not stack:
                return False
            else:
                tmp = stack.pop()
                if tmp == '(': tmp = ')'
                if tmp == '{': tmp = '}'
                if tmp == '[': tmp = ']'
                if c != tmp:
                    return False
        if stack:
            return False
        return True
```
\
**코드 2 (개선)**  
처리시간 59ms
```py
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        table = {
            ')': '(',
            '}': '{',
            ']': '[',
        }

        for char in s:
            if char not in table:
                stack.append(char)
            elif not stack or table[char] != stack.pop():
                return False
        return len(stack) == 0
```

## 3. 피드백
이번 문제의 경우 **코드 1**과 **코드 2**의 접근법(**스택**), 처리시간이 거의 일치합니다. 하지만 코드의 깔끔함이나 추후 수정 용이성을 따지면 **코드 2**가 우위에 있습니다. 그 이유는 다음과 같습니다.  
\
바로 **딕셔너리**의 활용입니다. **코드 1**의 경우 세 가지 괄호 문자를 하드코딩에 가까운 방식으로 작성했습니다. 하지만 **코드 2**의 경우 딕셔너리를 활용해 각 괄호 문자의 짝을 정의해줍니다. 이로 인해 얻는 장점은 다음과 같습니다.  
- 괄호의 종류가 추후에 늘어나더라도 시간 복잡도 **O(1)** 이 가능하다.  
- 괄호의 종류가 늘어나도 딕셔너리에만 추가해주면 된다.  
- 딕셔너리의 짝을 활용하므로 판별 로직이 훨씬 더 간단해진다.  
1번의 경우 의문이 생길 수도 있습니다. **코드 1**의 경우 괄호의 종류가 늘어날수록 괄호 검색 시간 복잡도가 **선형**으로 증가합니다. ex.) `if c == '(' or c == '{' or c =='[':`  
하지만 **딕셔너리**를 사용한 **코드 2**의 경우 괄호 검색 시간 복잡도가 **O(1)** 으로 고정됩니다. **해시 테이블**을 사용하기 때문입니다. ex.) `if char not in table:` , `table[char] != stack.pop():`  

## 4. 요약정리
**딕셔너리**를 활용하여 추후 데이터 **수정 용이성**이나 **시간 복잡도** 증가를 대비하자.  
괄호의 짝을 찾는 문제는 **스택**을 사용하면 간단하게 풀 수 있다.  
## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/valid-parentheses/](https://leetcode.com/problems/valid-parentheses/)
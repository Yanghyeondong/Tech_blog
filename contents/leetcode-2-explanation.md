---
date: '2022-10-30'
title: 'Leetcode 2번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 2번 두 수의 덧셈 문제 풀이, divmod() 함수'
thumbnail: './common/leetcode.png'
---
오랜만의 글입니다. 최근 운전면허 때문에 좀 바빴습니다. 😅
## 1. 문제 확인

[2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)
\
두 연결 리스트를 마치 정수처럼 인식하여 덧셈하는 문제입니다. 자릿수 올림을 편하게 하도록, 주어진 리스트와 답 리스트 모두 **뒤집어져** 있는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 105ms
```py
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        
        ans_head = ListNode(0)
        head = ans_head
        over_cnt = False

        while l1 or l2:
            l1_val = 0
            l2_val = 0

            if l1:
                l1_val = l1.val
                l1 = l1.next
            if l2:
                l2_val = l2.val
                l2 = l2.next

            node_sum = l1_val + l2_val

            if over_cnt:
                node_sum += 1
                over_cnt = False

            if node_sum > 9:
                over_cnt = True
                node_sum = node_sum % 10
                if not (l1 or l2):
                    l1 = ListNode(0)

            head.next = ListNode(node_sum)
            head = head.next

        return ans_head.next
```
\
**코드 2 (개선)**  
처리시간 120ms
```py
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        root = head = ListNode(0)

        carry = 0
        while l1 or l2 or carry:
            sum = 0
            if l1:
                sum += l1.val
                l1 = l1.next
            if l2:
                sum += l2.val
                l2 = l2.next

            carry, val = divmod(sum + carry, 10)
            head.next = ListNode(val)
            head = head.next

        return root.next
```

## 3. 피드백
이번에는 **코드 1**과 **코드 2**의 처리시간, 접근방식이 모두 비슷합니다. 다만 전반적인 코드 길이나 직관성은 **코드 2**의 승리입니다. 간단한 문제지만 역시 책에 있는 전문가의 코드를 따라가기엔 한참 먼 듯합니다. 😥  
\
**코드 1**의 경우 기본적으로 두 연결 리스트를 순회하면서 합을 구합니다. 이때 합이 10을 넘어 **올림**이 있을 경우 flag를 통해 다음 계산에 적용합니다. 해당 코드에서 의문이 생길만한 부분은 다음과 같습니다.  
```py
if not (l1 or l2): 
    l1 = ListNode(0)
```
위의 코드가 들어간 이유는 올림으로 인해 **새로운 자릿수**가 필요한 경우가 있기 때문입니다.  
예를 들어 `[1,2,3]` + `[5,6,7]` 의 경우 마지막의 `3`과 `7`을 더했을 때 새로운 자릿수가 나타나야 하지만 `while l1 or l2:` 부분에서 반복문이 종료됩니다. 따라서 `0`의 값을 가진 새로운 노드를 만들어 주는 것입니다.  
\
**코드 2**의 경우 **코드 1**에서 복잡했던 부분이나 예외 상항을 없애고 깔끔하게 정리된 모습입니다.  
몇 가지 차이점을 정리해보면 다음과 같습니다.
> 1. `l1_val`, `l2_val` 같은 변수를 만들지 않고 바로 `sum`에 노드 값을 더한다  
> 2. `%` 연산자가 아닌 `divmod()` 함수를 통해 올림과 나머지를 계산한다   
> 3. `while l1 or l2 or carry:` 조건을 사용해 주어진 노드의 순회가 끝나도 반복문을 유지한다.  
1번의 경우 불필요한 변수의 수를 줄여 **코드 1**보다 가독성이 높아집니다. 사소한 부분이지만 코드가 길어질수록 중요한 부분이라 생각합니다.  
2번의 경우 `True`, `False`  flag가 아닌 숫자 값 그 자체로 올림을 표현하면서도 함수를 통해 직관적으로 나머지를 계산합니다.  
3번의 경우 **코드 1**에서 예외를 두었던 `if not (l1 or l2):` 부분을 더 간단명료하게 해결할 수 있습니다.

## 4. 요약정리
`divmod()` 함수를 통해 `%` 연산자를 대신할 수 있다.  
불필요한 변수의 수를 줄여 가독성을 높이자. ex.) `l1_val` ➜ `l1.val`

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/add-two-numbers/](https://leetcode.com/problems/add-two-numbers/)
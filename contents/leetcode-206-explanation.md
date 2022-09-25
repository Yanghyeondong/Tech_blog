---
date: '2022-09-25'
title: 'Leetcode 206번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 206번 역순 연결 리스트 문제 풀이, 재귀 함수, 반복문'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[2. Add Two Numbers](https://leetcode.com/problems/reverse-linked-list/)
\
주어진 연결 리스트를 **뒤집는** 간단한 문제입니다. 맨 마지막 노드의 `next`는 `None`으로 해주는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 52 ms
```py
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        
        def rec_def(node: Optional[ListNode]):
            if node:
                next_node = rec_def(node.next)
                if next_node:
                    next_node.next = node
                node.next = None

            return node

        if not head:
            return head
        
        ans_head = head
        while ans_head.next:
            ans_head = ans_head.next

        rec_def(head)

        return ans_head
```
\
**코드 2 (개선)**  
처리시간 45 ms
```py
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        def reverse(node: ListNode, prev: ListNode = None):
            if not node:
                return prev
            next, node.next = node.next, prev
            return reverse(next, node)

        return reverse(head)
```
\
**코드 3 (개선)**  
처리시간 38 ms
```py
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        node, prev = head, None

        while node:
            next, node.next = node.next, prev
            prev, node = node, next

        return prev
```
## 3. 피드백
이번에는 **코드 1**이 **코드 2**나 **코드 3**에 비해 조금 긴 편입니다. 시간 복잡도는 **O(n)** 으로 모두 동일하며 처리시간도 크게 차이 나지 않습니다.  
\
우선 **코드 1**의 경우 저번 문제 [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) 를 의식해서 **재귀 함수**로 만들어 보았습니다. 주요 아이디어는 다음과 같습니다.
> 1. 역순 정렬 후 **시작**(리턴) 노드가 될 **마지막** 노드 `ans_head` 찾기   
> 2. **현재** 노드, **다음** 노드의 역순 연결 **직전**에 다음 노드로 **재귀** 호출
> 3. 마지막 재귀에서 백트래킹 시작과 동시에 **역순 연결**, `ans_head` 리턴
**코드 1**은 전반적으로 깔끔하지 못해 아쉬운 점이 많았습니다.  
\
우선 `if not head:`를 작성한 이유는 다음과 같습니다. 만약 인자로 빈 리스트, `None`이 들어올 경우 `ans_head.next`에서 오류가 발생하기 때문에 예외를 작성해야 합니다.  
\
다음으로 `ans_head`를 따로 구한 이유는 다음과 같습니다. 해당 재귀 함수로는 정답 리스트의 `head` 부분을 매개변수로 전해주지 못하기 때문입니다. 원인은 해당 함수의 **구조상 한계** *(재귀 호출 시점)* 와 **매개변수**가 1개뿐이라는 점입니다. 이는 정답 `head`를 바로 리턴하지 못하고 추가적인 외부 코드로 따로 처리해 주어야 하는 상황을 만듭니다. 이후 보게 될 **코드 2**의 경우 매개변수 2개와 재귀 호출 시점 변경으로 이를 해결합니다.  
\
종합적으로 **코드 1**은 재귀를 사용하기는 했지만 예외처리가 많고 깔끔하지 못한 모습을 보입니다.  
\
다음은 **코드 2**입니다. 같은 재귀지만 훨씬 깔끔합니다. 주요 아이디어는 다음과 같습니다.  
> 1. **이전** 노드, **현재** 노드의 **역순 연결**
> 2. **현재** 노드와 **다음** 노드로 **재귀** 호출
> 3. 마지막 재귀에서 백트래킹을 통해 마지막 **정답 노드** 리턴
**코드 1**의 경우 재귀 호출 코드가 역순 연결 코드 **이전**에 있습니다. 즉, 백트래킹까지 가야지 비로소 역순 연결이 시작됩니다. 이에 따라 마지막 정답 `head`를 따로 저장하고 재귀가 끝나는 시점에서 불러오기가 힘듭니다 *(물론 매개변수가 1개인 것도 영향이 있습니다)*.  
\
하지만 **코드 2**의 경우 재귀 호출 부분이 역순 연결 부분 **이후**에 있어 역순 연결이 순차적으로 진행됩니다. 따라서 백트래킹까지 가면 바로 연속적인 리턴을 통해 마지막 정답 `head`가 도출됩니다. 또한, 빈 노드일 때 따로 예외 처리를 해주지 않아도 됩니다.  
\
**코드 3**의 경우 **코드 2**의 개념을 재귀가 아닌 **반복문**으로 구현한 것입니다. 아마 필자가 재귀를 의식하지 않았으면 비슷하게 작성했을 것이라 생각됩니다. 간단히 `[1, 2, 3]` 으로 예시를 들면 다음과 같습니다.  
\
`1` ➜ `node`  
`None` ➜ `prev`  
\
`2` ➜ `next`  
`None` ➜ `node(1).next`  
`1` ➜ `prev`  
`2` ➜ `node`  
\
`3` ➜ `next`  
`1` ➜ `node(2).next`  
`2` ➜ `prev`  
`3` ➜ `node`  
\
`None` ➜ `next`  
`2` ➜ `node(3).next`  
`3` ➜ `prev`  
`None` ➜ `node` 

## 4. 요약정리
재귀 함수 사용 시 **호출 시점**과 **매개변수 개수** 등을 잘 고려하자.  
재귀 대신 반복문을 사용하면 메모리 사용을 줄여 **공간 복잡도**를 낮출 수 있다.

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*
- leetcode  
  https://leetcode.com/problems/reverse-linked-list/](https://leetcode.com/problems/reverse-linked-list/)
---
date: '2022-11-01'
title: 'Leetcode 24번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 24번 페어의 노드 스왑 문제 풀이, and 연산 특징, 재귀 함수'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[24. Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)
\
주어진 연결 리스트에서 노드를 순서대로 2개씩 **짝지어 스왑** 하는 문제입니다. 노드 내부의 값을 변경하면 안 되는 것이 포인트입니다.
> **leetcode 설명**  
> You must solve the problem without modifying the values in the list's nodes  
> (i.e., only nodes themselves may be changed.)

## 2. 코드

**코드 1**  
처리시간 55ms
```py
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        
        if not (head and head.next):
            return head

        prev_node = ListNode(None)
        first_node = head
        second_node = ans_head = head.next
        
        while second_node:

            next_node = second_node.next
            second_node.next, first_node.next, prev_node.next = first_node, next_node, second_node

            if not next_node:
                break

            first_node, second_node, prev_node = next_node, next_node.next, first_node

        return ans_head
```
\
**코드 2 (개선)**  
처리시간 52ms
```py
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:

        root = prev = ListNode(None)
        prev.next = head

        while head and head.next:
            b = head.next
            head.next = b.next
            b.next = head

            prev.next = b
            head = head.next
            prev = prev.next.next

        return root.next
```
\
**코드 3 (개선)**  
처리시간 47ms
```py
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if head and head.next:
            p = head.next
            head.next = self.swapPairs(p.next)
            p.next = head
            return p
        return head
```

## 3. 피드백
이번에는 직접 작성한 **코드 1**과 책에 있는 **코드 2**의 접근법이 유사합니다. 다만, 여전히 **코드 1**은 예외처리나 반복문 조건 등에서 상대적으로 깔끔하지 못한 모습을 보입니다. **재귀**를 사용한 **코드 3**의 경우 가장 공간 복잡도가 적으면서도 아주 간결하게 보입니다. 가능한 최선이라고 볼 수 있습니다.  
\
**코드 1**과 **코드 2**의 기본적인 아이디어는 다음과 같습니다.

> 1. 최초의 `prev`(root) 노드를 만들어 준다. 
> 2. 이후 순차적으로 2개의 노드 pair를 골라 **스왑**한다.  
> 3. 스왑이 끝나면 이전 `prev` 노드와 연결하고 새로운 `prev` 노드를 다음 반복문으로 넘겨준다.    

여기서 **코드 1**이 **코드 2**에 비해 부족했던 점을 정리해보면 다음과 같습니다.  
- 불필요한 다중 할당이 많아 직관적이지 못하다.  
- `if not (head and head.next):` , `if not next_node:` 등 예외 조건이 많다.  
**다중 할당**의 경우 한 줄로 스왑 등의 기능을 편하게 이용할 수 있는 장점이 있지만 길어질 경우 직관성이 떨어집니다.
예를 들어 **코드 1**의 `second_node.next, first_node.next, prev_node.next = first_node, next_node, second_node`의
경우 마지막 `prev_node.next`는 밑줄에 따로 써도 문제가 없고 더 직관적입니다. 하지만 줄 수를 줄이기 위해 다중 할당을 쓴 결과 오히려 가독성이 떨어졌습니다.  
\
다음으로 예외 조건입니다. **코드 1**의 경우 `None` 타입에 대해서 `.next`를 사용할 경우 런타임 오류가 발생하기에  `while second_node:`, `if not next_node:` 등의 조건을 붙였습니다.  
하지만 **코드 2**의 경우 `while head and head.next:` 조건 하나만으로 이를 해결합니다. 이것이 가능한 이유는 `head`가 `None`일 경우 `and` 연산의 특성으로 인해 해당 조건문의 판정이 바로 끝나기 때문입니다. 즉, `head.next` 인한 오류 전에 계산이 끝납니다.  
\
이처럼 전반적으로 비슷한 접근법과 아이디어 일지라도, 코드를 좀 더 직관적이고 가독성 있게 표현하는 능력을 길러야겠습니다. 😔  
\
마지막으로 **코드 3**은 **재귀**를 통해 문제를 매우 세련되게 풉니다. 기본적인 아이디어를 정리해 보면 다음과 같습니다. 
> 1. 순차적으로 2개의 노드 pair를 고른다.  
> 2. pair 중 앞선 노드(스왑 후 뒤따르는 노드)의 `.next`를 재귀 함수를 통해 호출한다.  
> 3. 노드가 `None`일 경우 자기 자신을, 이외에는 스왑이 끝난 pair 중 앞선 노드를 리턴한다. 
> 3. 백 트래킹을 통해 `.next` 가 정해지면 다음 pair와 연결되면서 노드가 스왑 된다.  
> 4. 최초로 돌아갈 때까지 이를 반복한다.
이러한 방식은 변수도 굉장히 적게 사용하고 코드도 최소한으로 사용하게 되어 모든 면에서 우위라고 생각합니다. 필자의 경우 처음부터 반복문으로 풀 생각이었는데, 재귀로 도전했어도 이런 해답에 도달하기는 힘들었을 것입니다. 아직도 배워야 할 점이 산더미처럼 남아있는 기분입니다. 😥

## 4. 요약정리
불필요한 **다중 할당**은 가독성을 떨어뜨린다.  
조건문 내에서 `and` 연산의 특성을 활용해 런타임 오류와 예외 상황 코드를 줄여보자.  
**재귀** 방식을 통해 더 적은 변수, 공간 복잡도를 도전해보자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/swap-nodes-in-pairs/submissions/](https://leetcode.com/problems/swap-nodes-in-pairs/submissions/)
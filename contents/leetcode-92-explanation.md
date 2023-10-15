---
date: '2023-10-15'
title: 'Leetcode 92번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 92번 역순 연결 리스트 II 문제 풀이,'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[92. Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)
\
인덱스로 정해준 범위 내에서 주어진 연결 리스트의 일부를 역순으로 바꾸는 문제입니다. 인덱스가 0이 아닌 1부터 시작하는 것이 포인트입니다. ~뭔가 석연치 않은 인덱싱 방식입니다 😫~

## 2. 코드

**코드 1**  
처리시간 55ms
```py
class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        head_idx = 1
        stack = []
        root = prev = ListNode(None)
        root.next = head

        while head_idx < left:
            head = head.next
            prev = prev.next
            head_idx += 1
        left_start = head

        while head_idx <= right:
            stack.append(head)
            head = head.next
            head_idx += 1
        right_end = head

        while stack:
            prev.next = stack.pop()
            prev = prev.next

        left_start.next = right_end

        return root.next
```
\
**코드 2 (개선)**  
처리시간 52ms
```py
class Solution:
    def reverseBetween(self, head: ListNode, m: int, n: int) -> ListNode:

        if not head or m == n:
            return head

        root = start = ListNode(None)
        root.next = head

        for _ in range(m - 1):
            start = start.next
        end = start.next

        for _ in range(n - m):
            tmp, start.next, end.next = start.next, end.next, end.next.next
            start.next.next = tmp
        return root.
```

## 3. 피드백
이번에는 **코드 1**과 **코드 2**의 접근 방식이 조금 다릅니다. 다만 둘 다 시간 복잡도 **O(n)** 이기 때문에 처리시간은 비슷합니다.
\
우선 **코드 1**의 경우 주요 아이디어는 **스택**이며, 간단히 풀이해보면 다음과 같습니다. 
- 주어진 인덱스 내의 노드들을 **스택**(리스트)에 집어넣는다  
- 순회가 끝난 후 **스택**(리스트)에서 `pop`으로 꺼내어 다시 연결해준다  
사실 파이썬에는 따로 스택 자료 구조는 없고, 리스트가 그 상위 호환으로 역할을 대신합니다.  
`root = prev = ListNode(None)`를 준 이유는 리스트 최초의 노드가 인덱스에 포함될 경우 답으로 리턴할 노드가 필요해서입니다.  
`prev`는 인덱스로 인해 끊어지는 지점을 저장하기 위함이고, `left_start`는 역순 정렬 마지막 노드와 원래 나머지 노드를 연결하기 위함입니다. 사실상 `prev`와 동일하지만, 반복문 `prev = prev.next`으로 인해 범위를 벗어나므로 따로 정해준 것입니다.  
\
다음으로는 **코드 2**입니다. 주요 아이디어를 정리해보면 다음과 같습니다.
- 인덱스가 끊어지는 시작 지점 `tmp`을 잡는다.  
- 인덱스 범위의 노드를 순회하며 순차적으로 `tmp`위치에 삽입하고 `.next`를 연결한다.
여기서 몇 가지 의문이 들만한 점은 다음과 같습니다.  
`if not head or m == n:`의 경우 연결 리스트가 비어있거나 유효 범위가 없어 변화가 필요 없을 때의 상황을 나타냅니다. 하지만 사실 주어진 테스트 케이스에서는 해당 부분이 없어도 무방합니다.  
\
**코드 1**의 경우도 이러한 예외가 있을 법 한데, 지금 보니 운 좋게도 알아서 처리가 됩니다. 예를 들어 `[1,2]` 에서 `n` = `2`, `m` = `2` 일 경우 `left_start` = `1`, `right_end` = `None`이 되며, `prev.next = stack.pop()` 을 통해 `1 ➜ 2`이 됩니다. 마지막으로는 `left_start.next = right_end` 를 통해 `1 ➜ 2 ➜ None`이라는 답이 도출됩니다.  
\
추가적으로 `for _ in range(m - 1):`에서 `_`의 경우 딱히 반복에 따른 인덱스 변수가 필요하지 않을 때 대신 사용하는 문자입니다.  

## 4. 요약정리
역순 정렬의 경우 **스택**(LIFO) 사용을 기본적으로 떠올리자  
예외상황을 운 좋게 넘어갈 수도 있지만, 항상 유념한 상태로 코드를 설계하자.  
`for` 문에서 `_` 를 통해 의미 없는 인덱스 변수를 대신한다.  


## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/reverse-linked-list-ii/](https://leetcode.com/problems/reverse-linked-list-ii/)
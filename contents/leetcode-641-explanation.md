---
date: '2022-11-23'
title: 'Leetcode 641번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 641번 원형 데크 디자인 문제 풀이, 이중 연결 리스트, 내부 함수'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[641. Design Circular Deque](https://leetcode.com/problems/design-circular-deque/submissions/)
\
**원형 데크**(circular deque)를 구현하는 문제입니다. 자세한 설명은 다음과 같습니다.
> **leetcode 설명**  
> `MyCircularDeque(int k)` Initializes the deque with a maximum size of k.  
> `boolean insertFront()` Adds an item at the front of Deque.  
> `boolean insertLast()` Adds an item at the rear of Deque.  
> `boolean deleteFront()` Deletes an item from the front of Deque.  
> `boolean deleteLast()` Deletes an item from the rear of Deque.  
> `int getFront()` Returns the front item from the Deque. Returns -1 if empty.  
> `int getRear()` Returns the last item from Deque. Returns -1 if the deque is empty.  
> `boolean isEmpty()` Returns true if the deque is empty, or false otherwise.  
> `boolean isFull()` Returns true if the deque is full, or false otherwise.  

## 2. 코드

**코드 1**  
처리시간 86ms
```py
class Node(object):
    def __init__(self, data, prev = None, next = None):
        self.data = data
        self.prev = prev
        self.next = next

class MyCircularDeque:

    def __init__(self, k: int):

        self.size_now = 0
        self.size_max = k
        self.front = self.rear = None

    def insertFront(self, value: int) -> bool:
        if self.isFull():
            return False
        temp = Node(value)

        if self.isEmpty():
            self.front = self.rear = temp
        else:
            self.two_way_link(temp, self.front)
            self.front = temp
        self.size_now += 1
        return True

    def insertLast(self, value: int) -> bool:
        if self.isFull():
            return False
        temp = Node(value)

        if self.isEmpty():
            self.front = self.rear = temp
        else:
            self.two_way_link(self.rear, temp)
            self.rear = temp
        self.size_now += 1
        return True

    def deleteFront(self) -> bool:
        if self.isEmpty():
            return False
        self.size_now -= 1
        
        if self.size_now == 0:
            self.front = self.rear = None
            return True
        temp, self.front = self.front, self.front.next
        del temp
        return True

    def deleteLast(self) -> bool:
        if self.isEmpty():
            return False
        self.size_now -= 1
        
        if self.size_now == 0:
            self.front = self.rear = None
            return True
        temp, self.rear = self.rear, self.rear.prev
        del temp
        return True

    def getFront(self) -> int:
        return -1 if self.isEmpty() else self.front.data

    def getRear(self) -> int:
        return -1 if self.isEmpty() else self.rear.data

    def isEmpty(self) -> bool:
        return self.size_now == 0

    def isFull(self) -> bool:
        return self.size_now == self.size_max

    def two_way_link(self, node1, node2) -> None:
        node1.next = node2
        node2.prev = node1
```
\
**코드 2 (개선)**  
처리시간 79ms
```py
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


class MyCircularDeque:
    def __init__(self, k: int):
        self.head, self.tail = ListNode(None), ListNode(None)
        self.k, self.len = k, 0
        self.head.right, self.tail.left = self.tail, self.head

    def _add(self, node: ListNode, new: ListNode):
        n = node.right
        node.right = new
        new.left, new.right = node, n
        n.left = new

    def _del(self, node: ListNode):
        n = node.right.right
        node.right = n
        n.left = node

    def insertFront(self, value: int) -> bool:
        if self.len == self.k:
            return False
        self.len += 1
        self._add(self.head, ListNode(value))
        return True

    def insertLast(self, value: int) -> bool:
        if self.len == self.k:
            return False
        self.len += 1
        self._add(self.tail.left, ListNode(value))
        return True

    def deleteFront(self) -> bool:
        if self.len == 0:
            return False
        self.len -= 1
        self._del(self.head)
        return True

    def deleteLast(self) -> bool:
        if self.len == 0:
            return False
        self.len -= 1
        self._del(self.tail.left.left)
        return True

    def getFront(self) -> int:
        return self.head.right.val if self.len else -1

    def getRear(self) -> int:
        return self.tail.left.val if self.len else -1

    def isEmpty(self) -> bool:
        return self.len == 0

    def isFull(self) -> bool:
        return self.len == self.k
```

## 3. 피드백  
이번에는 **원형 데크** 라는 **추상적 자료형**(ADT)를 구현하는 문제입니다. 저번 문제 [622. Design Circular Queue](https://yangdongs.web.app/leetcode-622-explanation/)와 매우 유사합니다. 이번에도 **코드 1**과 **코드 2**가 많은 부분을 공유하지만, 몇몇 부분에서 차이를 보입니다.  
\
이번 피드백에서도 저번처럼 자세한 풀이는 생략하고 차이점만 짚어보겠습니다. 원형 데크 ADT 자체가 이미 정의되어있기 때문입니다(함수 이름 및 언어만 다를 뿐). 개념 설명은 링크로 대체하겠습니다.  
[geeksforgeeks.org/implementation-deque-using-circular-array/](https://www.geeksforgeeks.org/implementation-deque-using-circular-array/)  
\
**코드 1**과 **코드 2**의 차이점은 다음 3개로 요약이 가능합니다.
- 인덱스 노드 `head(front)` 와 `tail(rear)`의  실제 값 여부  
- 내부 함수 `two_way_link`, `_add`, `_del`의 역할
- `del`함수의 사용
우선 **코드 1**과 **코드 2**는 각각 데크의 가장 앞과 뒤를 가리키는 용도로 `head(front)`, `tail(rear)`을 사용합니다. 하지만 **코드 1**의 경우는 실제로 `head`, `tail`에 값이 들어있는 반면, **코드 2**는 `None` 값으로 계속 유지가 됩니다. 즉, **코드 1**은 연산에 따라 **인덱스 노드가 계속 변하고**, **코드 2**는 연산과 상관없이 **인덱스 노드가 고정**되어 있습니다.   
이러한 차이는 **코드 1**에서 `if self.isEmpty():  self.front = self.rear = temp`같은 조건문을 만들어 냅니다. 또한, 이어지는 내부 함수에도 영향을 끼칩니다.  
\
이어서 내부 함수 차이입니다. 두 코드 모두 내부 함수를 사용하지만, 그 용도가 조금 다릅니다.  
**코드 1**의 `two_way_link`는 단순히 2개의 노드를 **양방향**으로 연결해 줍니다. 이러한 함수를 만든 이유는, 노드를 삽입하는 과정에서 해당 기능이 공통적으로 필요했기 때문입니다. 하지만 지나고 생각해보니 그냥 **다중 할당**으로 처리하는 게 오히려 직관적이라 생각됩니다. 😥  
\
**코드 2**의 `_add`, `_del`의 경우 좀 더 복잡한 역할을 맡게 됩니다.  
앞서 말한 것처럼 **코드 2**는 `head`, `tail` 자체가 `None`으로 유지, 고정되는 노드입니다. 따라서 단순히 새로운 노드를 붙이고 `self.head(self.tail)`를 재지정해주는 것이 불가능합니다.  
\
`_add`는 이러한 이유로 `self.head(self.tail.left)`와 그 바로 다음 노드 `self.head.right(self.tail)` 사이를 찢고 새로운 노드 `new`를 넣어주는 역할까지 합니다.  
`_del`도 비슷한 맥락으로 `self.head(self.tail.left.left)`와 `self.head.right.right(self.tail)` 사이의 기존 노드를 잘라내고 나머지를 다시 이어줍니다.  
\
추가적으로, **코드 1**의 `two_way_link`의 경우 **[PEP8](https://peps.python.org/pep-0008/#method-names-and-instance-variables)** 의 규칙을 따르지 않습니다.  

>In addition, the following special forms using leading or trailing underscores are recognized (these can generally be combined with any case convention):  
> - `_single_leading_underscore`: weak “internal use” indicator. E.g. from M import * does not import objects whose names start with an underscore.  

따라서 `_add`, `_del`처럼 `_two_way_link` 로 정의하는 것이 좋습니다.  
\
마지막으로 `del`함수입니다. **코드 1**에서는 삭제 연산에서 메모리 누수를 줄이기 위해 `del`연산으로 노드 메모리를 해제합니다. 물론 짧은 테스트 케이스에서는 큰 차이가 없겠지만, 점점 연산이 많아질수록 메모리를 효율적으로 사용합니다. ~~드디어 책의 코드를 이겼다. 😂~~  

## 4. 요약정리
**이중 연결 리스트**로 ADT를 구현할 때는, **인덱스 노드**의 역할과 **내부 함수** 사용을 고민해 보자.  
클래스 **내부 함수**를 사용할 때는 **[PEP8](https://peps.python.org/pep-0008/#method-names-and-instance-variables)** 의 규칙에 따라 함수명 앞에 `_`를 붙이자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/design-circular-deque/submissions/](https://leetcode.com/problems/design-circular-deque/submissions/)
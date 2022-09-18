---
date: '2022-09-18'
title: 'Leetcode 234번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 234번 팰린드롬 연결 리스트 문제 풀이, deque() 자료 구조, 다중 할당'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[234. Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)
\
**팰린드롬** 확인 문제입니다. 다만, 주어진 형태가 **연결 리스트**인 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 1619 ms
```py
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:

        temp_head = head
        val_list = []

        while temp_head:
            val_list.append(temp_head.val)
            temp_head = temp_head.next
        if val_list == val_list[::-1]:
            return True

        return False
```
\
**코드 2 (개선)**  
처리시간 1703ms
```py
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        q: Deque = collections.deque()

        if not head:
            return True

        node = head
        while node is not None:
            q.append(node.val)
            node = node.next

        while len(q) > 1:
            if q.popleft() != q.pop():
                return False

        return True
```
\
**코드 3 (개선)**  
처리시간 696ms
```py
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        rev = None
        slow = fast = head
        while fast and fast.next:
            fast = fast.next.next
            rev, rev.next, slow = slow, rev, slow.next
        if fast:
            slow = slow.next

        while rev and rev.val == slow.val:
            slow, rev = slow.next, rev.next
        return not rev
```
## 3. 피드백
이번에는 **코드 1,2,3** 모두 시간 복잡도 **O(n)** 으로 동일하며, 시간은 **코드 3**이 비교적 빠른 편입니다.  
\
**코드 1**의 경우 주어진 연결 리스트를 파이썬의 **리스트**로 바꾼 다음 **슬라이싱**을 통해 팰린드롬을 확인합니다. 크게 설명할 것이 없는 간단한 풀이입니다.  
\
**코드 2**의 경우 `deque()` 자료 구조를 사용합니다. 주어진 연결 리스트를 deque에 넣은 다음 `popleft()` 와 `pop()`을 사용합니다. 이때 `while len(q) > 1:` 라는 조건인 이유는 다음과 같습니다.
> 1. 길이가 홀수인 경우 마지막 중앙 숫자는 비교하지 않는다.  
> 2. 길이가 짝수인 경우 마지막 길이가 0 에서 멈춘다.  
\
마지막으로 **코드 3**의 경우 **런너**라는 기법을 사용합니다. 속도가 다른 두 개의 런너(포인터)를 만들어서 중앙까지의 **역순 연결 리스트**를 만들고 이를 통해 팰린드롬을 판별합니다. 해당 코드에서 헷갈릴 만한 부분은 크게 2가지 정도입니다.  
\
우선은 `if fast:` 부분입니다. 해당 부분은 짝수 홀수의 경우를 나누기 위해서입니다.
> 1. `[1, 2, 3, 2, 1]`   
> ➜ `fast`가 마지막 1에 도착했을 때  `slow` 는 3에 멈춰있고 `rev` 에는 3이 없다.  
> 2. `[1, 2, 2, 1]`   
> ➜ `fast`가 마지막 None에 도착했을 때 `slow` 는 2에 멈춰있고 `rev` 에는 2가 있다.  
\
이어서 **다중 할당**입니다. **코드 3**에서는 다음 부분에 사용되었습니다.  
`rev, rev.next, slow = slow, rev, slow.next`  
이러한 다중 할당은 주의해야 할 점이 있습니다. 바로 **우측 값들이 좌측 값의 갱신 이전에 정해진다는 것**입니다. 앞선 **코드 3**의 예시를 조금 더 풀어서 설명하면 다음과 같습니다.  
> 1. `rev` 가 `slow`로 바뀌기 전에 `rev.next`에는 `rev`가 할당  
> 2. `slow` 에 할당되는 `slow.next` 는 `rev = slow` 와 `rev.next = rev` 로 인해 갱신되지 않은 `slow`
이러한 이유로 인해 다중 할당 사이의 순서가 바뀌더라도 결과는 똑같습니다. 아직도 헷갈린다면 다음의 간단한 코드를 보시면 됩니다.
```py
a = [1]
b = [2]
c = [3]
d = [4]

a, b, c = d, a, b

print(f"a:{a} b:{b} c:{c}")
```
위의 결과물은 `a:[4] b:[1] c:[2]` 입니다.
```py
a = [1]
b = [2]
c = [3]
d = [4]

a = d
b = a
c = b

print(f"a:{a} b:{b} c:{c}")
```
위의 결과물은 `a:[4] b:[4] c:[4]` 입니다.

## 4. 요약정리
`deque()`와 `popleft()`,`pop()` 을 통해 처음과 끝 비교가 가능하다.  
속도가 다른 두 개의 **런너**(포인터)를 통해 노드의 **특정 지점**(중심)등을 찾을 수 있다.  
**다중 할당**에서 우측 값들은 좌측 값의 갱신 **이전에** 정해진다.

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/palindrome-linked-list/](https://leetcode.com/problems/palindrome-linked-list/)
---
date: '2022-11-06'
title: 'Leetcode 328번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 328번 홀짝 연결 리스트 문제 풀이, 반복문과 예외처리'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[328. Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/submissions/)
\
주어진 연결 리스트의 **홀수**번째 노드들을 순차적으로 연결하고, 그 뒤에 다시 **짝수**번째 노드들을 연결하는 문제입니다. 공간 복잡도 **O(1)**, 시간 복잡도 **O(n)** 에 푸는 것이 포인트입니다.  
~저처럼 홀수 '값'을 가진 노드 뒤에 짝수 '값'을 가진 노드를 붙이는 삽질은 하지 마세요~

## 2. 코드

**코드 1**  
처리시간 49ms
```py
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head:
            return head

        odd, even = head, head.next
        root_odd = head_odd = ListNode(None)
        root_even = head_even = ListNode(None)
        prev = None

        while True:
            head_odd.next = odd
            head_even.next = even
            head_odd = head_odd.next
            head_even = head_even.next
            prev = head_odd

            if odd and ((even and not even.next) or (not even)):
                prev.next = root_even.next
                break

            odd = odd.next.next
            even = even.next.next

        return root_odd.next
```
\
**코드 2 (개선)**  
처리시간 39ms
```py
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if head is None:
            return None

        odd = head
        even = head.next
        even_head = head.next

        while even and even.next:
            odd.next, even.next = odd.next.next, even.next.next
            odd, even = odd.next, even.next

        odd.next = even_head
        return head
```

## 3. 피드백
이번에는 **코드 1**과 **코드 2**의 처리 시간 및 아이디어가 거의 동일합니다. 다만 여전히 코드의 줄 수나 변수의 재활용성 등은 책에 있는 **코드 2**가 더 세련되어 있습니다. 주요 아이디어는 다음과 같습니다.

> 1. 서로 붙어있는 홀수 짝수 노드를 2개씩 짝지어 순회한다.  
> 2. 홀수 노드와 짝수 노드의 `.next` 를 두 칸 건너뛴 다음 노드로 연결한다. 이를 반복한다.    
> 3. 마지막으로 홀수 노드 끝의 `.next` 를 짝수 노드의 `head`에 연결한다.  

위의 방식대로 풀면 문제의 조건인 공간 복잡도 **O(1)** , 시간 복잡도 **O(n)** 을 만족합니다.  
리스트의 길이와 상관없이 정해진 수만큼의 변수를 사용하므로 공간 복잡도 **O(1)** 이 되고, 
반복문은 연결 리스트를 한 번만 순회하므로 시간 복잡도 **O(n)** 이 됩니다.  
\
여기서 **코드 1**과  **코드 2**의 차이점을 분석해보면 다음과 같습니다.  
\
우선 **코드 1**의 경우 새로운 리스트인 `root_odd`와 `root_even` 를 만들어 활용하고 답으로 리턴합니다. 이에 반해 **코드 2**의 경우 기존의 변수를 재활용해서 변수의 수를 줄입니다. 예를 들어 `root_odd` 의 역할은 기존의 `head`가 하고 `prev`는 기존의 `odd` 변수를 그대로 활용했습니다.  
\
솔직히 필자도 **코드 1**을 짜면서 여러 변수를 없앨 수 있었지만 각 변수가 의미하는 바를 이름으로 명확히 나타내어 아이디어를 정리하려 했습니다. 이 같은 행동이 나중에 실제 프로젝트에서 해가 될지 득이 될지는 아직 잘 모르겠습니다. 어차피 **객체지향**적인 코드는 그 내부를 보여주지 않으니 **최적화**가 답 같기도 하고, 언젠가 다른 사람이 봤을 때 **직관적이고 수정하기 쉽도록** 만들어 두는 게 답 같기도 합니다. 이 둘 사이에서 가장 적당한 방향성을 찾아내는 게 중요한 것 같습니다.  
\
말이 길어졌습니다. 😅 다음은 **코드 1**에서 의문이 생길만한 조건문입니다.  
`if odd and ((even and not even.next) or (not even)):`  
위의 조건문은 반복문을 끝내기 위해 만들었습니다. 연결 리스트의 마지막은 다음 경우로 나뉩니다.  
`[1,2,3]`  
➜ ... ➜ `3` ➜ `None`  
`[1,2,3,4]`  
➜ ... ➜ `3` ➜ `4` ➜ `None`  
2개씩 짝을 지어 순회하기 때문에 끝 부분이 위처럼 2가지 경우로 좁혀집니다.  반복문 자체에 `odd = odd.next.next` 같은 부분이 있기에 런타임 오류를 방지하기 위해 `break`됩니다. 여기서 `3` ➜ `None` 의 경우에는 `odd and not even` , `3` ➜ `4` ➜ `None` 의 경우엔 `odd and (even and not even.next)` 이 됩니다.

## 4. 요약정리
공간 복잡도 **O(1)** 은 입력값과 상관없이 **정해진 갯수**의 변수만을 사용하여 문제를 풀자.  
상황에 따라 변수를 최대한 줄여 **최적화** 할지, 명시해주어 **직관적**으로 만들지 고민해보자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/odd-even-linked-list/submissions/](https://leetcode.com/problems/odd-even-linked-list/submissions/)
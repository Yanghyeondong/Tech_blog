---
date: '2022-11-30'
title: 'Leetcode 23번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 23번 k 정렬 리스트 병합 문제 풀이, 우선순위 큐, 힙'
thumbnail: './common/leetcode_hard.png'
---
## 1. 문제 확인

[23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
\
**정렬된** 연결 리스트를 **k**개 받습니다. 각 리스트의 노드들을 **오름차 순**으로 정렬하여 **하나의** 연결 리스트를 만들면 됩니다. hard 난이도로 소개됩니다.

## 2. 코드

**코드 1**  
처리시간 Time Limit Exceeded
```py
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        if not lists:
            return None
        
        root = tail = ListNode(sys.maxsize)
        lists_empty = False
        heads = [list for list in lists]
        
        while not lists_empty:
            min_node = root
            min_index = 0
            
            for i, head in enumerate(heads):
                if not head:
                    continue
                if min_node.val >= head.val:
                    min_node = head
                    min_index = i

            if min_node.val != sys.maxsize:
                tail.next = min_node
                tail = tail.next
                heads[min_index] = min_node.next
                tail.next = None

            lists_empty = True
            for head in heads:
                if head:
                    lists_empty = False

        return root.next
```
\
**코드 2 (개선)**  
처리시간 181ms
```py
import heapq
from typing import List

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        root = result = ListNode(None)
        heap = []

        for i in range(len(lists)):
            if lists[i]:
                heapq.heappush(heap, (lists[i].val, i, lists[i]))

        while heap:
            node = heapq.heappop(heap)
            idx = node[1]
            result.next = node[2]

            result = result.next
            if result.next:
                heapq.heappush(heap, (result.next.val, idx, result.next))

        return root.next
```

## 3. 피드백
이번에는 필자의 **코드 1**이 Time Limit Exceeded로 실패했습니다. 이에 반해 알고리즘 책의 **코드 2**는 무난하게 통과한 것으로 보입니다. 당연하게도 시간 복잡도상 **코드 2**의 승리입니다. 😥  
\
**코드 1**의 경우, Time Limit 전까지의 테스트는 문제없이 통과한 것으로 보아 알고리즘 자체는 문제가 없는 모양입니다. 비록 시간 복잡도 통과는 못했지만, 아이디어는 간단하게 정리해보겠습니다.  
- 주어진 연결 리스트들마다 `head`노드(리스트 내 최솟값)를 트래킹 한다.  
- 트래킹 하는 노드 중 최솟값을 찾아 답에 연결하고, 해당 `head`는 `next`로 넘어간다.  
이러한 방법을 사용할 경우, 최악의 경우를 생각해보면 다음과 같습니다.  
편의상 자료의 개수를 `n`, 트래킹 하는 `head` 개수를 `n/2`라 가정합니다.  
\
`[1, 2, 3, 4, 5, 6, 7, n/2]`  
`[n/2 + 1]`  
`[n/2 + 2]`  
.  
.  
`[n]`  
\
위의 경우, `1`을 찾을 때 `n/2 + 1`에서 `n`까지 비교합니다. 그리고 다음 순서인 `2`를 찾을 때도 `n/2 + 1`에서 `n`까지 비교하고, 이는 계속 반복됩니다. 결국 첫 번째 연결 리스트만 해도 연산 과정이 최소 **n/2 * n/2** 이 되고, 시간 복잡도는 **O(n^2)** 입니다.  
\
**코드 2**는 이러한 문제를 **우선순위 큐**(Priority queue)인 **최소 힙**(min heap) 자료구조를 통해 해결합니다. ~~저한테는 놀랍게도~~ 파이썬은 `heapq` 자료구조를 지원하며, 이는 리스트 인덱싱을 기반으로 합니다. 아이디어를 정리하면 다음과 같습니다.  
\
⭐**TIP**⭐ 리스트, 튜플은 대소 비교 연산자를 지원하며 비교는 첫 원소부터 시작한다.
- 주어진 k개의 연결 리스트들을 `heapq`에 `push` 한다.
- `push`는 튜플(노드 값, 리스트 인덱스, 노드)로 한다. 인덱스는 `heapq`중복 불가 특성상 필요.
- `heapq`에서 가장 작은 튜플을 뽑고, 해당 노드를 답에 연결한다.
- 뽑은 튜플의 연결 리스트는 다음 노드로 변경해준다. `heapq`가 사라질 때까지 반복한다.
**코드 2**의 경우도 `heapq`를 제외하면 기본적인 알고리즘은 **코드 1**과 비슷합니다. 단지 최솟값을 찾을 때 선형적으로 찾는 것이 아니라 `heapq` 구조에 `push`, `pop`을 반복함으로써 **log(n)** 만에 찾습니다. 이러한 방식을 사용하면 전체적으로 **log(n) * n** 의 시간이 걸리므로 시간 복잡도 **O(nlog(n))** 이 됩니다.  

## 4. 요약정리
우선순위 큐를 사용하는 문제는 `heapq`를 응용해 **O(nlog(n))** 으로 처리하자.  
파이썬은 리스트, 튜플 대소 비교를 지원하며 비교는 첫 원소부터 시작한다.

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/merge-k-sorted-lists/](https://leetcode.com/problems/merge-k-sorted-lists/)
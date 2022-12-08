---
date: '2022-12-08'
title: 'Leetcode 706번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 706번 해시 맵 디자인 문제 풀이, 해시 함수'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[706. Design HashMap](https://leetcode.com/problems/design-hashmap/)
\
자료의 저장과 열람을 지원하는 **Hash Map(table)** 을 구현하는 문제입니다. 파이썬의 딕셔너리와 유사하며, 내장된 해시 테이블 기능을 사용하지 않는 것이 포인트입니다. 
> **leetcode 설명**  
> `MyHashMap()` initializes the object with an empty map.  
> `void put(int key, int value)` inserts a (key, value) pair into the HashMap. If the key already exists in the map, update the corresponding value.  
> `int get(int key)` returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key.  
> `void remove(key)` removes the key and its corresponding value if the map contains the mapping for the key.  

## 2. 코드

**코드 1**  
처리시간 502ms
```py
class ListNode:
    def __init__(self, key=None, val=None, next=None):
        self.key = key
        self.val = val
        self.next = next

class MyHashMap:

    def __init__(self):
        self.map_size = 500
        self.h_map = [ListNode(None, None) for _ in range(self.map_size)]

    def _hash(self, key: int) -> ListNode:
        seed = key % self.map_size
        return self.h_map[seed]
        
    def put(self, key: int, value: int) -> None:
        node = self._hash(key)
        while node.next:
            if node.next.key == key:
                node.next.val = value
                return
            node = node.next
        node.next = ListNode(key, value)

    def get(self, key: int) -> int:
        node = self._hash(key)
        while node and node.key != key:
            node = node.next
        return -1 if not node else node.val

    def remove(self, key: int) -> None:
        node = prev = self._hash(key)
        while node and node.key != key:
            prev = node
            node = node.next
        if node:
            prev.next = node.next
```
\
**코드 2** (개선)  
처리시간 493ms
```py
class ListNode:
    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.next = None


class MyHashMap:
    def __init__(self):
        self.size = 1000
        self.table = collections.defaultdict(ListNode)

    def put(self, key: int, value: int) -> None:
        index = key % self.size
        if self.table[index].value is None:
            self.table[index] = ListNode(key, value)
            return

        p = self.table[index]
        while p:
            if p.key == key:
                p.value = value
                return
            if p.next is None:
                break
            p = p.next
        p.next = ListNode(key, value)

    def get(self, key: int) -> int:
        index = key % self.size
        if self.table[index].value is None:
            return -1

        p = self.table[index]
        while p:
            if p.key == key:
                return p.value
            p = p.next
        return -1

    # 삭제
    def remove(self, key: int) -> None:
        index = key % self.size
        if self.table[index].value is None:
            return

        p = self.table[index]
        if p.key == key:
            self.table[index] = ListNode() if p.next is None else p.next
            return

        prev = p
        while p:
            if p.key == key:
                prev.next = p.next
                return
            prev, p = p, p.next
```

## 3. 피드백
이번에는 필자가 작성한 **코드 1**이 **코드 2**보다 전반적으로 짧고, 처리시간도 크게 차이 나지 않습니다. 😎 게다가 리트코드의 설명 중에 다음과 같은 내용이 있습니다.  
> Design a HashMap without using any built-in hash table libraries.  
파이썬의 딕셔너리 자료구조도 엄밀히 말하면 해시 테이블을 사용하기 때문에, `collections.defaultdict`를 사용한 **코드 2**는 조건에서 살짝 어긋난다고 볼 수 있습니다.  
\
이번 피드백에서도 자세한 풀이는 생략하고 차이점만 짚어보겠습니다. **Hash Map(table)** ADT 자체가 이미 잘 정의되어있기 때문입니다. 개념 설명은 링크로 대체하겠습니다. [https://www.interviewcake.com/concept/java/hash-map](https://www.interviewcake.com/concept/java/hash-map)  
\
**코드 1**과 **코드 2**의 차이점을 정리해보면 다음과 같습니다.  
1. `list`와 `collections.defaultdict`
2. 첫 번째 노드의 역할
3. 내부 함수의 유무
\
첫 번째로 **코드 1**이 사용하는 `list`와 **코드 2**가 사용하는 `collections.defaultdict`의 차이점입니다. **코드 1**은 `self.map_size` 크기만큼의 리스트를 만들고, 노드까지 다 할당해 놓습니다. 이러한 행동의 단점은 기본적으로 **Hash Map**을 만드는 순간부터 상당한 공간을 사용한다는 것입니다.  
\
이에 반해 `collections.defaultdict`의 경우 없는 인덱스일 때만 새로운 노드를 만들어 할당합니다. 물론 파이썬 딕셔너리가 내부적으로 사용하는 공간이나 변수들도 있겠지만, **코드 1**처럼 모든 노드를 미리 할당하지는 않습니다.  
\
다음으로 각 **첫 번째 노드**의 체이닝 활용입니다. **코드 1**의 경우 첫 노드는 초기화된 그대로 두고 새로운 값이 들어왔을 때 그 뒤에 붙이기만 합니다. `node.next = ListNode(key, value)`  
반면, **코드 2**의 경우 자동으로 만들어진 노드를 없애고 새롭게 노드를 할당합니다. `self.table[index] = ListNode(key, value)`  
\
**코드 1**의 방식은 전반적으로 코드의 반복문이 간결해지고 예외처리가 없다는 장점이 있습니다. 하지만 항상 첫번째 노드를 무의미하게 지나치는 낭비가 존재합니다. 다만 리트코드의 테스트에서는 다른 연산의 처리시간이 길어서 그런지 **코드 1**과 **코드 2**의 시간이 크게 차이 나지 않습니다.  
\
마지막으로 내부 함수입니다. **코드 1**은 `key`값의 `mod`연산 후 해당 인덱스의 노드를 불러오는 역할을 `_hash` 함수로 정의했습니다. 이는 코드의 재사용성이 높아지는 장점이 있습니다.  

## 4. 요약정리
Hash Map 구현 시, **체이닝**과 **오픈 어드레싱** 방식을 고려하자.  
어떤 해시 함수가 충돌을 가장 줄일 수 있을지 고민하자.  
내부 함수를 통해 코드의 **재사용성**을 높이자.  
## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/design-hashmap/](https://leetcode.com/problems/design-hashmap/)
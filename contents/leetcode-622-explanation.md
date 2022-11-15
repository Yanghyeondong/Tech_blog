---
date: '2022-11-15'
title: 'Leetcode 622번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 622번 원형 큐 디자인 문제 풀이, 배열 활용'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[622. Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)
\
리스트를 이용해 원형 큐(환형 큐)를 구현하는 문제입니다. 자세한 설명은 다음과 같습니다.
> **leetcode 설명**  
> `MyCircularQueue(k)` Initializes the object with the size of the queue to be k.  
> `int Front()` Gets the front item from the queue. If the queue is empty, return -1.  
> `int Rear()` Gets the last item from the queue. If the queue is empty, return -1.  
> `boolean enQueue(int value)` Inserts an element into the circular queue.  
> `boolean deQueue()` Deletes an element from the circular queue.  
> `boolean isEmpty()` Checks whether the circular queue is empty or not.  
> `boolean isFull()` Checks whether the circular queue is full or not.  
## 2. 코드

**코드 1**  
처리시간 163ms
```py
class MyCircularQueue:

    def __init__(self, k: int):
        self.head = 0
        self.rear = 0
        self.queue_len = k
        self.queue = [0 for _ in range(self.queue_len)]
        self.is_full = False
        self.is_empty = True

    def enQueue(self, value: int) -> bool:
        if self.is_full:
            return False
        self.queue[self.rear] = value
        self.rear = (self.rear + 1) % self.queue_len
        self.is_empty = False
        if self.rear == self.head:
            self.is_full = True
        return True

    def deQueue(self) -> bool:
        if self.is_empty:
            return False
        self.head = (self.head + 1) % self.queue_len
        self.is_full = False
        if self.rear == self.head:
            self.is_empty = True
        return True

    def Front(self) -> int:
        if self.is_empty:
            return -1
        return self.queue[self.head]

    def Rear(self) -> int:
        if self.is_empty:
            return -1
        if self.rear == 0:
            rear = self.queue_len - 1
        else:
            rear = self.rear - 1
        return self.queue[rear]
    
    def isEmpty(self) -> bool:
        return self.is_empty
    
    def isFull(self) -> bool:
        return self.is_full
```
\
**코드 2 (개선)**  
처리시간 160 ms
```py
class MyCircularQueue:
    def __init__(self, k: int):
        self.q = [None] * k
        self.maxlen = k
        self.head = 0
        self.rear = 0

    def enQueue(self, value: int) -> bool:
        if self.q[self.rear] is None:
            self.q[self.rear] = value
            self.rear = (self.rear + 1) % self.maxlen
            return True
        else:
            return False

    def deQueue(self) -> bool:
        if self.q[self.head] is None:
            return False
        else:
            self.q[self.head] = None
            self.head = (self.head + 1) % self.maxlen
            return True

    def Front(self) -> int:
        return -1 if self.q[self.head] is None else self.q[self.head]

    def Rear(self) -> int:
        return -1 if self.q[self.rear - 1] is None else self.q[self.rear - 1]

    def isEmpty(self) -> bool:
        return self.head == self.rear and self.q[self.head] is None

    def isFull(self) -> bool:
        return self.head == self.rear and self.q[self.head] is not None
```

## 3. 피드백
이번에는 **원형 큐** 라는 **추상적 자료형**(abstract data type, ADT)를 구현하는 문제입니다. 따라서 **코드 1**과 **코드 2** 모두 유사한 모습을 보입니다. 처리시간도 거의 동일합니다. 하지만 역시 세부적인 부분에서 차이가 나며, 전반적으로 **코드 2**가 더 깔끔해 보입니다.  
\
이번 피드백에서 각 코드의 자세한 풀이는 생략하고 차이점만 짚어보겠습니다. **원형 큐** 라는 **ADT**가 이미 정의되어있기 때문입니다(세부사항 및 언어만 다를 뿐). 개념 설명은 링크로 대체하겠습니다. [https://www.programiz.com/dsa/circular-queue](https://www.programiz.com/dsa/circular-queue)  
\
**코드 1**과 **코드 2**의 가장 큰 차이점은 다음 2개로 요약이 가능합니다.
> 1. is_full, is_empty flag 유무  
> 2. 큐의 비어있는 칸 None 데이터 갱신  
우선 **코드 1**에서 `is_full`, `is_empty`를 사용한 이유는 다음과 같습니다.
- `isEmpty()`, `isFull()` 판정은 `enQueue()`, `deQueue()`, `Front()`, `Rear()`에도 필요하기에, 클래스 변수로 재활용  
하지만 만들고 보니 `isEmpty()`, `isFull()` 함수를 구현하고  나머지 함수에서 이를 호출하는 것이 더 직관적이겠다는 결론에 도달했습니다. 😓 ex.) `deQueue()`에서 `if isEmpty(): return -1`  
\
이어서 **코드 1**에서 `None` 데이터를 사용하지 않은 이유는 다음과 같습니다.  
- `rear` 과 `head`로 인해 유효한 큐 범위가 정확히 정의되므로, 데이터를 지우는 연산이 불필요  
이미 범위를 벗어난 데이터는 잘못 사용될 일이 없고, 공간이 필요하면 다시 덮어씌워 집니다. 따라서 위와 같이 효율성을 고려해서 `None`으로 초기화하지 않았습니다.  
\
하지만, 신기하게도 **코드 2**는 위의 2가지를 합쳐서 다음과 같이 응용했습니다.  
- 지워진 공간을 `None`으로 초기화하되, 이를 `isEmpty()`, `isFull()`의 판정에 활용한다.  
예를 들어 `rear == head` 인 상태는 완전히 비어있는 상황일 수도, 꽉 차서 더 이상 넣을 수 없는 상황일 수도 있습니다. 여기서 만약 `head` 값이 `None`이라면 비어있는 상황이므로 `isEmpty()`가 되고, `None`이 아닐 경우 `isFull()`이 됩니다.  
게다가 `enQueue()`, `deQueue()` 판정에서는 `rear == head`을 확인할 필요도 없이 `rear`과 `head`가 `None`이 아닌지만 확인하면 됩니다. (전체가 비거나 찬 것이 궁금한 게 아니라 현재 1칸의 값 여부가 필요한 것이므로). 확실히 깔끔하면서도 효율적인 코드인 것 같습니다. 😏  
\
단순히 *"굳이 값을 초기화하는 건 낭비다"* 라고 생각해서 더 좋은 풀이법을 놓친듯한 기분입니다. 앞으로는 의미 없어 보이는 과정이라도 잘 응용해서 좀 더 좋은 코드를 작성하는 법을 고민해 봐야겠습니다. 😥

## 4. 요약정리
비어있는 큐의 값을 `None`으로 초기화해주면 `isEmpty()`, `isFull()` 등의 판정이 간편해진다.  
단순히 연산 낭비라고 생각해서 좋은 풀이법을 놓치는 일이 없도록 하자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/design-circular-queue/](https://leetcode.com/problems/design-circular-queue/)
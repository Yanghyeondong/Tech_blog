---
date: '2022-11-11'
title: 'Leetcode 225번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 225번 큐를 이용한 스택 구현 문제 풀이, 데크(deque)'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)
\
**큐**를 이용하여 **스택**의 기본 연산들을 구현하는 문제입니다. 자세한 조건은 다음과 같습니다.  
> **leetcode 설명**  
> `void push(int x)` Pushes element x to the top of the stack.  
> `int pop()` Removes the element on the top of the stack and returns it.  
> `int top()` Returns the element on the top of the stack.  
> `boolean empty()` Returns true if the stack is empty, false otherwise.  

## 2. 코드

**코드 1**  
처리시간 58 ms
```py
class MyStack:
    def __init__(self):
        self.dq1 = deque()
        self.dq2 = deque()
        
    def push(self, x: int) -> None:
        self.dq1.append(x)

    def pop(self) -> int:
        for i in range(len(self.dq1)-1):
            self.dq2.append(self.dq1.popleft())

        poped_data = self.dq1.popleft()
        
        for i in range(len(self.dq2)):
            self.dq1.append(self.dq2.popleft())
        return poped_data

    def top(self) -> int:
        return self.dq1[-1]

    def empty(self) -> bool:
        return len(self.dq1)== 0
```
\
**코드 2 (개선)**  
처리시간 38ms
```py
class MyStack:
    def __init__(self):
        self.q = collections.deque()

    def push(self, x):
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self):
        return self.q.popleft()

    def top(self):
        return self.q[0]

    def empty(self):
        return len(self.q) == 0
```

## 3. 피드백
이번에는 얼핏 보면 **코드 1**과 **코드 2**가 비슷해 보이지만, 세부사항에 있어 차이가 큽니다. 처리시간은 비슷하며, 전반적인 코드의 깔끔함은 **코드 2**가 우위에 있습니다.  
단, 파이썬의 경우 큐가 따로 없기에 두 코드 모두 `deque`로 대체했습니다. 그리고 문제의 조건에 따라서 `popleft()`연산과 `append()` 연산만 제한적으로 사용하였습니다.   
\
우선 **코드 1**의 기본 아이디어는 다음과 같습니다.  
> 1. `push()`는 기존 `deque`의 `append()`와 동일하다.  
> 2. `pop()`의 경우, 2개의 `deque`를 준비한다.   
> 3. `deque_1`에서 맨 마지막 요소를 제외한 나머지를 모두 임시 `deque_2`로 이동한다.  
> 4. 다시 임시 `deque_2`에서 `deque_1`로 모든 요소를 옮기고, 저장해 두었던 마지막 요소를 `return` 한다.  
위에서 굳이 2개의 큐를 사용한 이유는 문제의 설명 중에 다음이 있었기 때문입니다.  
~**코드 2**는 큐를 1개만 써서 더 효율적인 게 억울합니다 😭~  
> Implement a last-in-first-out (LIFO) stack using only two queues.
이러한 **코드 1**에는 사실 한가지 맹점이 있습니다. `top()` 연산에서 `self.dq1[-1]`를 사용하는데, 이는 사실 큐가 기본으로 지원하는 연산이 아닙니다. **데크(deque)** 구조이기 때문에 가능한 것입니다.  
\
통상 `peek()` 연산으로 가장 앞의 원소, 즉 큐에서 다음으로 `pop()` 되는 원소인 `self.dq1[0]` 을 써야 하는 게 맞습니다. 하지만 **코드 1**에서는 이렇게 하려면 다시 큐를 뒤집거나 순회해야 하는 불편함이 있습니다. 이것의 해결법은 다음 **코드 2**에 소개되어 있습니다.  
\
**코드 2**의 기본 아이디어는 **코드 1**과는 조금 다릅니다.  
> 1. `pop()`은 기존 `deque`의 `popleft()`와 동일하다.  
> 2. `push()`의 경우, 우선 새로운 원소를 `append()` 하는 것 까지는 동일하다.   
> 3. 단, 새로운 원소를 제외한 기존 원소들을 `popleft()`로 뺀 다음 다시 `append`한다.  
> 4. 뒤집힌 상태로 저장된 큐는, `pop()` 연산시 가장 최근 것이 나오게 된다.  
**코드 1**은 `push()`를 유지하고 `pop()`을 바꾼 반면에, **코드 2**는 `pop()`을 유지하고 `push()`를 수정했습니다. 이 둘은 비슷해 보이긴 하지만 분명한 차이가 있습니다. 그리고 앞서 말했던 것처럼 `top()` 연산에서 `q[0]` 를 바로 활용하기 위해서는 **코드 2**의 방법이 더 깔끔하다고 할 수 있습니다.  
\
또한 **코드 1**은 `pop()`연산 한 번에 큐를 2번 뒤집으므로 `push()`에서 한 번만 뒤집는 **코드 2**보다 처리시간에 있어 불리합니다. 물론, `pop()`보다 `push()`가 훨씬 많은 코드에서는 **코드 1**이 더 유리할 수도 있습니다. 🧐

## 4. 요약정리
`deque` 자료형 및 `popleft()`, `append()`, `deque[0]` 연산만으로 `stack` 구현이 가능하다.  


## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/implement-stack-using-queues/](https://leetcode.com/problems/implement-stack-using-queues/)
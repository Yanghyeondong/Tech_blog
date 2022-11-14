---
date: '2022-11-14'
title: 'Leetcode 232번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 232번 스택을 이용한 큐 구현 문제 풀이, 분할 상환 분석(amortized analysis)'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
\
**스택**를 이용하여 **큐**의 기본 연산들을 구현하는 문제입니다.  
저번 [225. Implement Stack using Queues](https://yangdongs.web.app/leetcode-225-explanation/) 과 정반대 문제입니다. 자세한 조건은 다음과 같습니다.  
> **leetcode 설명**  
> `void push(int x)` Pushes element x to the back of the queue.  
> `int pop()` Removes the element from the front of the queue and returns it.  
> `int peek()` Returns the element at the front of the queue.  
> `boolean empty()` Returns true if the queue is empty, false otherwise.  

## 2. 코드

**코드 1**  
처리시간 50ms
```py
class MyQueue:

    def __init__(self):
        self.stack_main = []
        self.stack_temp = []

    def push(self, x: int) -> None:
        self.stack_main.append(x)

    def pop(self) -> int:
        return self.get_first(True)

    def peek(self) -> int:
        return self.get_first(False)

    def empty(self) -> bool:
        return len(self.stack_main) == 0
    
    def get_first(self, is_pop: bool):
        
        stack_len = len(self.stack_main)-1
        for _ in range(stack_len):
            self.stack_temp.append(self.stack_main.pop())
        if is_pop:
            data = self.stack_main.pop()
        else:
            data = self.stack_main[-1]
        for _ in range(stack_len):
            self.stack_main.append(self.stack_temp.pop())
            
        return data
```
\
**코드 2 (개선)**  
처리시간 52ms
```py

class MyQueue:
    def __init__(self):
        self.input = []
        self.output = []

    def push(self, x):
        self.input.append(x)

    def pop(self):
        self.peek()
        return self.output.pop()

    def peek(self):
        if not self.output:
            while self.input:
                self.output.append(self.input.pop())
        return self.output[-1]

    def empty(self):
        return self.input == [] and self.output == []
```

## 3. 피드백
이번에는 **코드 1**과 **코드 2**가 살짝 비슷해 보입니다. 둘 다 스택을 **2개** 활용하기 때문입니다. 하지만 접근법과 시간 복잡도를 따져보면 **코드 2**가 훨씬 더 효율적입니다. 다만 서버에 편차가 있었는지, 혹은 테스트 케이스가 무난해서 그런지 leetcode 처리시간은 서로 비슷합니다.🙄  
\
우선 **코드 1**은 저번 [225. Implement Stack using Queues](https://yangdongs.web.app/leetcode-225-explanation/) 문제에서 사용한 아이디어를 응용했습니다. 처음에는 저번 문제의 **코드 2**처럼, 추가  공간없이 1개의 스택만으로 문제를 풀 수 없을까 고민했습니다. ex.) `self.dq2.append(self.dq1.popleft())`. 하지만 스택을 뒤집는 연산을 위해서는 무조건 **추가 공간**이 필요하기 때문에 2개의 스택을 사용했습니다. 아이디어를 간단히 정리하면 다음과 같습니다.  
> 1. `pop()`, `peek()`의 경우 모든 요소들을 다 뺀 후 집어넣는 기능이 공통으로 필요하다.
> 2. 위의 기능을 `get_first()`로 구현, 마지막 요소 `pop()`을 상황에 맞게 실행한다.  
다음으로 **코드 2**입니다. 스택을 2개 사용하긴 하지만, 그 과정이 훨씬 효율적입니다. 정리해보면 다음과 같습니다.  
> 1. `input`, `output` 총 2개의 스택을 사용한다.
> 2. `input`은 입력값을 저장하는 용도이다. `output`은 `pop()`, `peek()`등의 연산 결과에 필요한 정보를 바로 구할수 있도록 뒤집어서 저장하는 용도이다.  
> 3. `pop()`, `peek()`는 같은 기능을 공유하므로 `peek()`를 활용하여 `pop()`을 구현한다.  
즉, 이미 뒤집어진 데이터가 `output`에 존재하면 그대로 빠르게 활용하고, 없을 경우에만 다시 `input`을 뒤집어서 저장하는 것입니다. 이러한 방식은 `pop()`이나 `peek()`가 연속적으로 발생할 때 아주 빠른 속도를 보여줍니다.  
\
이러한 **코드 1**과 **코드 2**의 효율성 차이는 **분할 상환 분석(amortized analysis)** 으로 보면 이해가 됩니다. 두 코드 모두 한 번의 `push()`당 시간 복잡도는 **O(1)** 입니다. 그리고 데이터가 입력된 상태에서 한 번의 `pop()`당 **코드 1**은 **O(n)** 이 소요됩니다. 하지만 **코드 2**는 최초의 한 번에만 **O(n)** 이 소요되고, 나머지는 **O(1)** 이 소요됩니다. 현재 `output`이 모두 소진되기 전까지는 말입니다. 따라서 n개의 데이터가 있다고 가정하는 경우, **평균적**으로 봤을 때 **O(1)** 이 걸립니다.   
\
이 같은 분석 방식을 **분할 상환 분석**이라 하며, **코드 2**의 알고리즘은 **분할 상환 상수 시간(amortized constant time)** 을 가진다고 할 수 있습니다.  
\
~그런데 왜 leetcode 처리시간은 비슷한 걸까요. 얼마나 테스트 케이스가 단순하면... 😝~
## 4. 요약정리
2개의 스택을 `input`, `output` 으로 분리하면 **분할 상환 상수 시간**으로 풀이가 가능하다.  
시간 복잡도를 확인할 때는 단순히 최악의 한 가지 경우가 아닌 **분할 상환 분석**을 고려해보자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/implement-queue-using-stacks/](https://leetcode.com/problems/implement-queue-using-stacks/)
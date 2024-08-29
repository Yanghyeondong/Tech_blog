---
date: '2022-11-24'
title: '파이썬 인스턴스 변수 외부 선언'
categories: ['Python','Tip']
summary: '파이썬 인스턴스 변수 특징 이해 및 외부 변수 선언'
thumbnail: './common/python.png'
---
## 1. 미리 보는 결론
- 인스턴스 변수는 `__init__` 생성자 **외부**에서도 **선언 가능**하다.
- 단, 이러한 행동은 협업 & 보수 측면에서 **지양**하는 것이 좋다.

## 2. 문제 인식
알고리즘 문제 [641. Design Circular Deque](https://hyeondong.com/leetcode-641-explanation/) 를 풀다가, 다음과 같은 난관에 부딪혔습니다.  
\
**코드**
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
```
\
해당 문제에서는 **이중 연결 리스트**를 통해 데크 ADT를 구현합니다. 하지만 해당 코드의 노드 클래스는 **단일 방향 리스트**의 형태로 잘못 정의되었습니다. ex. `self.next = None`.  
여기까지는 단순히 코드 오타라고 볼 수 있지만, 문제는 매우 **정상적으로 작동**한다는 것입니다. 🙄  
\
문제가 되는 부분을 찾아보면 다음과 같습니다.  
- `self.head.right, self.tail.left = self.tail, self.head`  
해당 코드에서 `.right`와 `.left`는 정의되어 있지 않음에도 잘만 선언되고, 작동합니다.  

## 3. 설명 & 추가 테스트
이러한 상황이 가능한 이유는 파이썬 인스턴스 특징 때문입니다. 파이썬은 인스턴스 변수를 해당 클래스의 `__init__` 생성자에 선언하지 않더라도, **아무 때나** 선언이 가능합니다. 다음은 그 예시입니다.  
\
**코드**
```py
class Test:
    def __init__(self):
        pass

def main():
    test_0 = Test()
    test_1 = Test()
    test_0.data = 0
    test_1.data = 1

    print(test_0.data)
    print(test_1.data)
```
**결과**
```py
0
1
```
아무것도 생성자에 선언되지 않았음에도, `.data` 항목이 잘 선언되고 호출되는 모습입니다.

## Source

- 알고리즘 Github issues 및 Pull requests  
  [https://github.com/onlybooks/algorithm-interview/issues/160](https://github.com/onlybooks/algorithm-interview/issues/160)

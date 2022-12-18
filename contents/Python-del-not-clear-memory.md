---
date: '2022-12-18'
title: '파이썬 del 은 객체의 메모리를 진짜로 지울까?'
categories: ['Python','Tip']
summary: '파이썬 del, Reference counting, Generational garbage collection 의 관계'
thumbnail: './common/python.png'
---
## 1. 미리 보는 결론
- `del` 은 객체 자체를 지우지 않는다. 객체는 여전히 메모리를 점유한다.  
- 메모리 해제는 **Reference counting**, **Generational garbage collection** 가 한다.
- 결국 객체의 모든 참조가 끊어지거나(Ref count = 0) `gc.collect`가 실행되어야 한다.
## 2. 문제 인식
**원형 데크 코드 일부**
```py
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
```
\
위의 코드는 이중 연결 리스트로 구현된 원형 데크의 삭제 연산을 구현한 함수입니다. 여기서 필자는 `del`을 통해 노드의 객체를 삭제함과 동시에 메모리 누수를 줄이려고 했습니다. 마치 **C언어**의 `free()` 같은 역할을 기대하면서 말입니다.😎  
\
하지만 `del`의 역할을 조금 더 찾아보니 생각과는 다르단 걸 알게 되었습니다. 파이썬의 `del`은 해당 변수와 객체의 참조만 끊을 뿐 **객체를 직접적으로 삭제하거나 메모리를 해제하지 않는다**고 합니다.  
\
파이썬에서 메모리 매니지먼트는 **Reference counting** 및 **Generational garbage collection** 에 의해 일어나기 때문입니다.  
## 3. 설명
다음은 CPython의 **Garbage Collection**에 대한 간단한 설명입니다. [출처](https://stackify.com/python-garbage-collection/)
> There are two aspects to memory management and garbage collection in CPython:
> - Reference counting  
> - Generational garbage collection  

> 📌 **Reference counting** in CPython  
> The main garbage collection mechanism in CPython is through reference counts. Whenever you create an object in Python, the underlying C object has both a Python type (such as list, dict, or function) and a reference count.  
> At a very basic level, a Python object’s reference count is incremented whenever the object is referenced, and it’s decremented when an object is dereferenced.  
> **If an object’s reference count is 0, the memory for the object is deallocated**.  
> \
> 📌 **Generational garbage collection** in CPython  
> In addition to the reference counting strategy for memory management, Python also uses a method called a generational garbage collector.  
> ```py  
> class MyClass(object):
>     pass
> 
> a = MyClass()
> a.obj = a
> del a
> ```  
> We call this type of problem a **reference cycle**, and you can’t solve it by reference counting. This is the point of the generational garbage collector, which is accessible by the gc module in the standard library.  
위의 내용을 요약하자면, 다음과 같습니다.  
- **Reference counting**은 객체의 참조 횟수를 관리하며 0이 된 경우 메모리에서 해제한다.  
- **Generational garbage collection**은 순환 참조와 같이 기존 방식으로 처리 불가능한 메모리를 해제한다.  
## 4. 추가 테스트
앞선 설명과 `del` 함수의 역할을 메모리 크기 테스트로 검증해보겠습니다.  
\
⭐**TIP**⭐ `memory_usage()` 함수의 경우 `psutil`를 사용했으며, 원본은 다음과 같습니다.  
```py
def memory_usage():
    p = psutil.Process()
    rss = p.memory_info().rss / (2 ** 20)
    print(f"memory usage: {rss: .0f} MB")
```
\
우선은 **Reference counting** 과 `del`의 관계를 알아보겠습니다.  
**코드 1**
```py
def main():
    a = ['data'] * (10 ** 7)
    b = a
    del a
    memory_usage()
```
**결과**
```py
memory usage:  90 MB
```
**코드 2**
```py
def main():
    a = ['data'] * (10 ** 7)
    del a
    memory_usage()
```
**결과**
```py
memory usage:  14 MB
```
\
**코드 1**과 **코드 2**의 차이점은 리스트를 참조하는 변수의 개수 차이입니다. **코드 1**의 경우 변수 `a`가 `del`로 인해 리스트와 참조가 끊깁니다. 하지만 `b`가 여전히 리스트를 참조하므로, Reference count가 0이 아닙니다. 따라서 `del` 함수를 사용했음에도 메모리가 줄어들지 않습니다.  
\
**코드 2**의 경우, `del`을 통해 `a`의 참조가 끊기자 더 이상 리스트를 참조하는 것이 없으므로 Reference count가 0이 되고, 메모리가 줄어들게 됩니다.  
\
위의 내용을 정리하면 다음과 같습니다.  
- `del`로 참조를 끊더라도 다른 참조가 남아있으면 여전히 해당 객체의 메모리는 해제되지 않는다.  
\
다음으로 `del`과 **Generational garbage collection**의 관계를 알아보겠습니다.   
**코드 1**
```py
class Data:
    def __init__(self):
        self.data = ['data'] * (10 ** 7)

def main():
    a = Data()
    a.ref = a
    del a
    # gc.collect()
    memory_usage()
```
**결과**
```py
memory usage:  90 MB
```
**코드 2**
```py
class Data:
    def __init__(self):
        self.data = ['data'] * (10 ** 7)

def main():
    a = Data()
    a.ref = a
    del a
    gc.collect()
    memory_usage()
```
**결과**
```py
memory usage:  14 MB
```
`Data` 클래스에 해당하는 인스턴스 `a`를 만들고, 해당 `a`에서 다시 `.ref`를 통해 **순환 참조**를 만들어 주었습니다. 이후 `del`을 통해 `a`와 인스턴스 간 참조를 끊음으로써 더 이상 사용자가 인스턴스에 접근하지 못하게 합니다.  
\
이때, 사용자 접근은 불가능 하지만 참조는 여전히 존재하므로 **Reference counting**에서 잡아내지 못합니다.  
\
결국 **코드 1**처럼 `del`만 사용할 경우 리스트가 여전히 메모리를 점유 중입니다. **코드 2**에서는 `gc.collect()`를 사용하자 정상적으로 메모리가 해제되는 것을 볼 수 있습니다.  
\
위의 내용을 정리하면 다음과 같습니다.  
- `del`로 참조를 끊은 후에 `gc.collect()`를 사용해야 메모리가 해제되는 경우도 있다.  
## Source

- stackify.com 'python-garbage-collection'  
  [https://stackify.com/python-garbage-collection/](https://stackify.com/python-garbage-collection/)

---
date: '2022-11-09'
title: 'Leetcode 739번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 739번 일일 온도 문제 풀이, 스택'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
\
일정 기간의 온도 리스트를 입력받고, 각 날짜마다 **더 따뜻한 날**(온도 초과)까지 필요한 시간을 찾는 문제입니다. **중복**된 온도가 존재할 수도 있으며, 조건에 맞는 날이 없는 경우 **0**으로 표현하는 것이 포인트입니다.  

## 2. 코드

**코드 1**  
처리시간 3896 ms
```py
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        stack_temp = []
        stack_date = []
        ans = [0 for i in range(0, len(temperatures))]

        for i, temp in enumerate(temperatures):
            if stack_temp and stack_temp[-1] < temp:
                while stack_temp and stack_temp[-1] < temp:
                    pop_date = stack_date.pop()
                    ans[pop_date] = i - pop_date
                    stack_temp.pop()
            stack_temp.append(temp)
            stack_date.append(i)
        return ans
```
\
**코드 2 (개선)**  
처리시간 3365 ms
```py
class Solution:
    def dailyTemperatures(self, T: List[int]) -> List[int]:
        answer = [0] * len(T)
        stack = []
        
        for i, cur in enumerate(T):
            while stack and cur > T[stack[-1]]:
                last = stack.pop()
                answer[last] = i - last
            stack.append(i)

        return answer
```

## 3. 피드백
이번에는 **코드 1**과 **코드 2**의 접근법, 처리시간, 코드의 형태까지 거의 동일합니다. 다만, **코드 1**에는 필요 없는 변수와 조건문이 남아있습니다. 😅 우선 주요 아이디어는 다음과 같습니다.  
> 1. 리스트를 순회하며 온도(혹은 날짜)를 **스택**에 쌓는다. `push` 하기 전 다음 조건을 본다.   
> 2. 최근 온도보다 현재 스택에 넣으려는 온도가 **더 클 경우** 이전 온도를 `pop`한다.  
> 3. `pop`할 때는 해당 온도의 날짜와 현재 온도의 **날짜 차**를 구하여 `ans`에 저장한다.  
> 4. 위 조건이 아닐 때까지 `pop`을 반복하고 현재 값을 `push`한다.  
해당 문제는 **스택**을 도입하면 명료하게 푸는 방향이 보입니다. 다만 **코드 1**에서 필요하지 않은, 부족했던 부분은 다음과 같습니다.  
\
우선 `stack_temp = []`입니다. 해당 스택은 온도를 저장하여 온도 비교를 위해 사용됩니다. 하지만 이것은 **필요가 없습니다**. 날짜를 저장하는 `stack_date = []`가 있기 때문에, 해당 날짜를 인덱스로 하는 `temperatures`의 값을 불러오면 언제나 온도를 알 수 있기 때문입니다.  
사실 처음에는 아이디어를 쉽게 떠올리기 위해 스택을 일부러 2개로 분리하였습니다. 하지만 코드가 완성되자 딱히 대수롭지 않게 생각했습니다. 앞으론 꼭 필요한 부분인지 다시 한번 생각하는 습관을 길러야겠습니다. 😫  
\
다음은 조건문 `if stack_temp and stack_temp[-1] < temp:` 입니다. 해당 부분도 처음 코드를 작성할 때, 최초의 `push` 조건을 생각하면서 만들었습니다. 하지만 결국 뒤의 `while stack_temp and stack_temp[-1] < temp:`에서 조건을 **반복** 확인하게 됩니다. 따라서 해당 부분도 결국 필요 없어집니다. 


## 4. 요약정리
새로운 변수나 자료 ( *ex. List* ) 를 할당할 때, 기존 자료로 대체할 수 있는지 충분히 확인하자.   
조건문 중 중복되거나 결합이 가능한 부분은 최대한 개선하자.  
➜ **메모리 공간, 코드 낭비 금지!** 🚫 

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/daily-temperatures/](https://leetcode.com/problems/daily-temperatures/)
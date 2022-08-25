---
date: '2022-08-24'
title: 'Leetcode 937번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 937번 로그 파일 정렬 문제 풀이, 람다 표현식'
thumbnail: './common/leetcode.png'
---

## 1. 문제 확인

[937. Reorder Data in Log Files](https://leetcode.com/problems/reorder-data-in-log-files/)
\
로그 파일 **정렬** 문제입니다. 정렬 우선순위는 **식별자, 문자, 숫자** 총 3가지 요소에 영향을 받습니다.

## 2. 코드

**코드 1**  
처리시간 89 ms
```py
class Solution:
    def reorderLogFiles(self, logs: List[str]) -> List[str]:
        splited_logs = []
        letter_array = []
        digit_array = []
        ans = []

        # split to compare digit & letter
        for string_log in logs:
            splited_logs.append(string_log.split())

        for array_log in splited_logs:
            if array_log[1].isalpha():
                letter_array.append(array_log)
            else:
                digit_array.append(array_log)

        # digit_array join
        i = 0
        for array_log in digit_array:
            string_log = " ".join(array_log)
            digit_array[i] = string_log
            i += 1

        # letter_array join & split to lambda sort
        j = 0
        for array_log in letter_array:
            string_log_key = array_log[0]
            del array_log[0]
            string_log_value = " ".join(array_log)
            string_log = [string_log_key, string_log_value]
            letter_array[j] = string_log
            j += 1

        letter_array.sort(key=lambda x: [x[1], x[0]])

        # letter_array join
        k = 0
        for array_log in letter_array:
            string_log = " ".join(array_log)
            letter_array[k] = string_log
            k += 1

        ans = letter_array + digit_array

        return ans
```
\
**코드 2 (개선)**  
처리시간 48ms
```py
class Solution:
    def reorderLogFiles(self, logs: List[str]) -> List[str]:
        letter_array = []
        digit_array = []

        for log in logs:
            if log.split()[1].isdigit():
                digit_array.append(log)
            else:
                letter_array.append(log)

        letter_array.sort(key=lambda x: (x.split()[1:], x.split()[0]))
        return letter_array + digit_array

```

## 3. 피드백
위 코드를 보면 처음에 직접 작성한 코드보다 책을 토대로 개선한 코드가 훨씬 짧습니다. ~~상당한 충격을 받았습니다~~. 지금까지 과제로 C 언어를 많이 쓴 나머지 없을 거라 착각한 기능들이 파이썬에는 많았습니다. 몇 가지 착오를 추려 보면 다음과 같습니다.

> 1.파이썬 sort는 key 값을 함수의 리턴 값으로도 정할 수 있습니다.  
> **ex.) key=lambda x: x.func()**  
> 2.파이썬 sort는 key 값을 여러 개로, 우선순위를 지정해서 줄 수 있습니다.  
> **ex.) key=lambda x: (x[1], x[0])**  
> 3.파이썬 List는 대소 비교가 가능합니다

1, 2번의 경우 이번 문제를 풀기 전 sort 함수를 재확인하면서 어느 정도 인지하고 람다 표현식도 썼지만, 익숙하지 않아서 그런지 코드가 깔끔하지 못한 모습을 보입니다. 3번은 numpy가 아니라 일반적인 파이썬에서도 지원하는지 미쳐 생각하지 못했습니다.  
\
코드를 개선해가는 과정을 정리해보겠습니다.

**코드1**
```py
# split to compare digit & letter
for string_log in logs:
    splited_logs.append(string_log.split())

for array_log in splited_logs:
    if array_log[1].isalpha():
        letter_array.append(array_log)
    else:
        digit_array.append(array_log)

# letter_array join & split to lambda sort
k = 0
for array_log in letter_array:
    string_log_key = array_log[0]
    del array_log[0]
    string_log_value = " ".join(array_log)
    string_log = [string_log_key, string_log_value]
    letter_array[k] = string_log
    k += 1

    letter_array.sort(key=lambda x: [x[1], x[0]])
```
위의 코드에서 split 하고 다시 join 한 처음 이유, 알고 보니 필요 없는 이유는 다음과 같습니다.  
\
식별자를 제외한 문자열을 sort 과정에서 key로 각각 사용하기 위해 split 및 join이 필요하다.  
**=> 파이썬 List는 그 자체로 대소 비교가 가능하다**  
\
즉, 원본 log를 split 하고 슬라이싱을 하면 key를 바로 구분하여 sort 할 수 있기 때문에 해당 부분은 다음과 같이 고칠 수 있습니다.

**코드2**
```py
for log in logs:
    if log.split()[1].isdigit():
        digit_array.append(log)
    else:
        letter_array.append(log)
        
letter_array.sort(key=lambda x: (x.split()[1:], x.split()[0]))
```

위와 똑같은 이유로, split 했던 문자열을 다시 조립하는 `# digit_array join`, `# letter_array join` 부분도 전부 필요가 없어집니다.  
\
이번 문제를 통해 앞으로는 파이썬의 내장 함수가 정확히 어떤 기능까지 지원하는지 잘 파악하고, 최대한 활용해야겠다고 생각했습니다.  

### 추가팁!
```py
i = 0
for array_log in digit_array:
    string_log = " ".join(array_log)
    digit_array[i] = string_log
    i += 1
```
위의 코드처럼 원본 배열의 값을 직접 수정한다면 다음과 같이 바꾸는 게 더 깔끔하고 직관적입니다.
```py
for i in range(len(digit_array)):
    string_log = " ".join(digit_array[i])
    digit_array[i] = string_log
```

## 4. 요약정리

파이썬 sort는 key 값을 함수의 리턴 값으로도 정할 수 있으며, 여러 개 key의 우선순위를 둘 수도 있다.
ex.) `letter_array.sort(key=lambda x: (x.split()[1:], x.split()[0]))`  
또한, 파이썬 List는 그 자체로 대소 비교가 가능하며 앞에서부터 순차적으로 값을 비교하게 된다.

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/reorder-data-in-log-files/](https://leetcode.com/problems/reorder-data-in-log-files/)
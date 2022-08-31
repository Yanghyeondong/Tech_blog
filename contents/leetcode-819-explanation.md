---
date: '2022-08-31'
title: 'Leetcode 819번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 819번 가장 흔한 단어 문제 풀이, re.sub 과 정규식 counts.most_common 인자'
thumbnail: './common/leetcode.png'
---

## 1. 문제 확인

[819. Most Common Word](https://leetcode.com/problems/most-common-word/)
\
문자열에서 **가장 많이 사용된 단어**를 찾는 문제입니다. 예외 조건은 다음과 같습니다.
>**banned** 단어 리스트  
>**공백**  
>**!?',;.** (구두점)  
>**대소문자** 구분  
## 2. 코드

**코드 1**  
처리시간 48 ms
```py
class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        paragraph = re.sub("[!?',;.]", " ", paragraph).lower()
        word_dic = {}

        for word in paragraph.split():
            if word not in banned:
                if word in word_dic:
                    word_dic[word] = word_dic[word] + 1
                else:
                    word_dic[word] = 1

        ans = max(word_dic, key=word_dic.get)
        return ans
```
\
**코드 2 (개선)**  
처리시간 80ms
```py
class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        words = [word for word in re.sub(r'[^\w]', ' ', paragraph)
            .lower().split() if word not in banned]
        counts = collections.Counter(words)
        return counts.most_common(1)[0][0]

```

## 3. 피드백
이번 코드는 재밌게도 필자가 작성한 **코드 1**이 책의 **코드 2**보다 더 빨랐습니다.
다만, 간결한 컴프리헨션 표현이나 Counter 클래스의 사용법 등에서 배울 점이 많기에 이를 정리해보았습니다.  
\
우선 `re.sub()` 함수입니다. 해당 함수와 **정규식**을 통해 문제의 조건중 **!?',;.** (구두점)을 제거할 수 있습니다.
아래의 두 코드가 각자 의미하는 바는 다음과 같습니다.
```py
re.sub("[!?',;.]", " ", paragraph)
# !?',;. 문자들을 공백으로 치환한다
```
```py
re.sub(r'[^\w]', ' ', paragraph)
# 알파벳+숫자를 제외한 문자들을 공백으로 치환한다. 
# `[^\w]` 은 `[\W]` 과 동일하다. `r`은 raw string을 의미하며 해당 코드에서는 없어도 상관없다.
```
이번 문제에서는 위의 두 코드가 동일한 의미로 적용되었지만, 때에 따라서는 전혀 다르게 해석될 수도 있습니다. **ex.) 주어진 이메일 주소에서 @가 포함되어야 하는 경우**.
그러므로 각 문제에서 예외나 조건을 잘 구분하고 가장 직관적인 정규식을 찾는 게 중요하다고 생각됩니다.  
\
다음으로는 **리스트 컴프리헨션**이 있습니다.  
```py
words = [word for word in re.sub(r'[^\w]', ' ', paragraph)
    .lower().split() if word not in banned]
```
위의 코드는 문제의 조건을 만족하는 리스트를 만들 때 for 문이나 if 문을 여러 겹으로 쓰지 않고 한 줄로 완성합니다. 표현식이 간단해지는 장점이 있지만, 너무 조건이 많을 경우 가독성이 많이 저해되므로 for 문과 if 문으로 직접 풀어내야 합니다.  
\
이어서 **Counter**입니다.
```py
counts = collections.Counter(words)
return counts.most_common(1)[0][0]
```
Counter 클래스는 여러 타입의 데이터를 받아서 중복되는 데이터들의 개수를 알려줍니다. 이때 `counts.most_common`의 첫 인자 `(1)`은 가장 많이 중복된 단어를 순서대로 개수만큼 받아옵니다. 이번 문제에서는 가장 많은 1개만 필요하므로 1입니다.
다음으로 `[0][0]`의 경우에는 `[('ball',2)]`에서 **key**인 **ball**만 가져오기 위해서입니다.  
\
필자의 경우 위의 조건 필터링과 개수 체크를 for 문 안에서 동시에 진행했지만, 리스트 컴프리헨션과 개수 체크로 구분하는 것이 좀 더 효율적으로 보입니다. 다른 사람이 봤을 때, **데이터 클렌징** 부분과 **카운터**부분이 확실히 나누어져 이해가 쉽기 때문입니다. 다만, 처리시간 부분에서는 단점을 보입니다.  
```py
for word in paragraph.split():
    if word not in banned:
        if word in word_dic:
            word_dic[word] = word_dic[word] + 1
        else:
            word_dic[word] = 1

ans = max(word_dic, key=word_dic.get)
```


### 추가팁!
```py
re.sub("[!?',;.]", " ", paragraph)
```
위의 코드에서 대체 문자로 공백을 준 이유는 split 할 때 기준점으로 하기 위해서입니다.
예를 들어 입력값이 `[a, a, b, c,c,c,c]` 일 경우, 공백을 주지 않으면 `a a b cccc`가 되어버리고, 
split 함수에 의해서 **c**가 아닌 **cccc**로 인식되어 **a**를 답으로 도출하기 때문입니다.
이와 별개로,  
```[a,　　　 a,b]``` 인 경우에는 split 함수가 알아서 공백을 없애서 **a,a,b**로 인식합니다.

## 4. 요약정리
re.sub()과 정규식을 통해 복잡한 데이터 클렌징 조건을 간단히 나타낼 수 있다.  
**ex.)** `re.sub("[!?',;.]", " ", paragraph)`  
Counter 클래스는 다양한 타입의 데이터에 대해 개수 체크 기능을 지원한다.  
**ex.)** `counts.most_common(1)[0][0]`  
다만, 위 방법이 딕셔너리, `max()` 등을 활용하는 것보다 처리시간이 늘어날 수 있다.

## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/most-common-word/](https://leetcode.com/problems/most-common-word/)
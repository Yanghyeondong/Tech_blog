---
date: '2023-10-30'
title: 'Leetcode 316번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 316번 중복 문자 제거 문제 풀이, Stack + Counter, 재귀'
thumbnail: './common/leetcode_hard.png'
---
## 1. 문제 확인

[316. Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/)
\
주어진 문자열에서 중복된 문자는 **1**개만 남기되, **사전식** *lexicographical* 으로 제일 앞에 오는 경우를 찾아야 하는 문제입니다. 난이도에 비해 완성된 코드는 간단한 것이 포인트입니다.  

## 2. 코드

**코드 1**  
처리시간 61ms
```py
class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        c_count = collections.Counter(s)
        stack = []
        exist = set()
 
        for c in s:
            if c in exist:
                c_count[c] -= 1
                continue

            while stack and stack[-1] > c and c_count[stack[-1]] > 1:
                c_count[stack[-1]] -= 1
                exist.remove(stack.pop())

            stack.append(c)
            exist.add(c)

        return ''.join(stack)
```
\
**코드 2 (개선)**  
처리시간 81ms
```py
class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        for char in sorted(set(s)):
            suffix = s[s.index(char):]
            if set(s) == set(suffix):
                return char + self.removeDuplicateLetters(suffix.replace(char, ''))
        return ''
```

## 3. 피드백
사실 이번에는 **코드 1**도 혼자만의 힘으로 짠 게 아니라 책의 힌트를 보고 작성했습니다. ~열심히 했지만, 버틸 수가 없었습니다 😓~. **코드 1**은 **스택**을 사용하며, **코드 2**의 경우는 **재귀**를 사용합니다. 재귀 특성상 **코드 2**가 훨씬 더 깔끔한 모습을 보여줍니다. 처리 시간은 크게 차이 나지 않습니다.  
\
처음에 시도해본 접근법은 다음과 같습니다.  
- 중복되지 않은 값을 찾고 **파티션**처럼 생각한다.  
- 중복된 값을 순회하며, 다음번에 있는 파티션 값보다 **작거나** 더 이상 **없을때만** 삽입한다.
예를 들어 `c b a c d c b c` 의 경우 `a`, `d` 를 파티션으로 지정합니다. 이후 `b`, `c` 를 순회하면서 위의 조건에 맞게 삽입합니다. 예를 들어 `b`의 경우 `a`와 `d` 사이에 들어가게 됩니다. 하지만 여기에서 바로 알 수 있듯이 해당 알고리즘의 문제가 발생합니다. 바로 마지막 `c b c` 부분에서 대처가 불가능합니다. `b` 를 먼저 순회하는지 `c`를 먼저 순회하는지에 따라 오답이 나오기도 하고, 애초에 이 뒤의 파티션 값이 없습니다.  
\
위 같은 실패를 겪고 나서 계속 다른 방법을 고민했습니다. 😰 하지막 결국 책을 보고 스택을 사용한 방법을 따라가게 되었습니다. 주요 아이디어는 다음과 같습니다.  
- 각 문자가 몇 번 중복되는지 **Counter**를 구한다. (특정 자리 이후 남은 횟수를 알기 위해)  
- 문자열을 앞부터 순회하며 스택에 `push` 하기 전 다음 조건을 본다.  
- 만약 이전의 스택 값이 현재 값보다 **크고**, 남은 횟수가 **있다면** `pop`한다.  
- 위의 조건이 아닐 때까지 `pop`을 반복하고 현재 값을 `push`한다.
위의 방식을 사용하면 시간 복잡도 **O(n)** 에 풀이가 가능합니다. 물론  `for c in s:` 내부의 `if c in exist:` 때문에 중첩 반복문 이기는 하지만, 알파벳 개수는 한정되어 있으므로 상수 취급이 가능합니다. 만약, 문자가 늘어나더라도 `set`이 아니라 `Counter`를 사용한다면 시간 복잡도 **O(1)** 이 되므로 문제없습니다.  
\
왜 필자는 위 같이 생각하지 못했는지 되돌아보았습니다. 우선 **스택**이라는 자료구조를 떠올리지 못한 것도 크지만, 알파벳들을 꼭 순서대로 순회하며 풀어야 한다는 **고정관념**이 있었습니다. 순서대로 `a`부터 `z`까지 차근차근 푼다는 생각 때문에, 문자열을 앞에서부터 바로 순회하는 방식 자체를 쉽게 떠올리지 못했습니다. 앞으로는 조금 더 유연한 사고를 위해 노력해야겠습니다. 😅  
\
다음은 재귀 방식인 **코드 2**입니다. 코드 2의 경우 다음과 같은 주요 아이디어를 가집니다. 
- 문자열에 사용된 알파벳을 정렬하여 차례대로 순회한다.  
- 특정 문자 뒤의 문자열을 `suffix`로 지정한다.   
- 지정된 `suffix`가 문자열에 사용된 알파벳 전체를 포함할 수 있는지 확인한다.  
- 위의 조건을 만족하면 특정 문자 + 나머지 문자열 중 특정 문자를 없앤 문자열을 리턴한다.  
위의 방식은 사실 직관적이지는 않습니다. 코드 자체는 짧아서 매우 깔끔하지만, 이해하려면 예시를 드는 게 좋을 것 같습니다.  
\
`c b a c d c b c` ➜ `a` + func (`c d c b c`)  
`c d c b c` ➜ `c` + func (`d b`)  
`d b` ➜ `d` + func (`b`)  
`b` ➜ ` `  
따라서 `a c d b` 가 답이 됩니다.  
\
**코드 2**는 얼핏 보면 반복문 안에 재귀 함수가 호출되므로 시간 복잡도가 **기하급수**적으로 올라갈 것처럼 보입니다. 하지만 `suffix` 가 조건을 충족하지 않으면 재귀 호출 자체가 되지 않습니다. 그리고 이러한 `suffix`가 충족되는 방향은 항상 정답을 향해가게 됩니다. 작은 순서부터 순회하는 특정 문자에 대해 `suffix`가 만족되는 순간 **무조건 답에 포함**이 되기 때문입니다. 그리고 답에 도달한 순간 `return`을 통해 나머지 분기는 끝나게 됩니다. 따라서 결국 시간 복잡도 **O(n)** 이 됩니다.  

## 4. 요약정리
중복 제거 문제는 **Stack** 과 **Counter** 로 접근해보자.  
특정 순서로 순회하며 문제를 푼다는 **고정관념**을 버리자. *ex.) 오름차순으로만 접근*  
**Counter**는 딕셔너리의 응용으로 시간 복잡도 **O(1)** 이다.  
## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/remove-duplicate-letters/](https://leetcode.com/problems/remove-duplicate-letters/)
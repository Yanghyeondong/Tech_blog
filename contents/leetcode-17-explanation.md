---
date: '2023-01-14'
title: 'Leetcode 17번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 17번 전화번호 문자 조합 문제 풀이, DFS, 백트래킹'
thumbnail: './common/leetcode_4.png'
---
## 1. 문제 확인

[17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/)
\
주어진 전화번호 자판을 바탕으로, 일련의 숫자를 입력할 수 있는 문자를 전부 찾아내는 문제입니다. 리턴하는 답에서 순서는 상관없는 것이 포인트입니다. 

## 2. 코드

**코드 1**  
처리시간 33ms
```py
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:

        digits = '@' + digits
        graph_dict = {}
        trans_dict = {
            '@': ['@'],
            '2': ['a', 'b', 'c'],
            '3': ['d', 'e', 'f'],
            '4': ['g', 'h', 'i'],
            '5': ['j', 'k', 'l'],
            '6': ['m', 'n', 'o'],
            '7': ['p', 'q', 'r', 's'],
            '8': ['t', 'u', 'v'],
            '9': ['w', 'x', 'y', 'z'],
        }
        paths = []

        def _dfs(char: str, path: str, depth: int):
            path += char
            if ((str(depth)+char) in graph_dict) and (len(path) < len(digits)):
                for c in graph_dict[(str(depth)+char)]:
                    _dfs(c, path, depth+1)
            else:
                if len(path) > 1:
                    paths.append(path[1:])
                return

        for i in range(len(digits)-1):
            for now_c in trans_dict[digits[i]]:
                graph_dict[str(i)+now_c] = []
                for next_c in trans_dict[digits[i+1]]:
                    graph_dict[str(i)+now_c].append(next_c)

        _dfs('@', '', 0)
        return paths
```
\
**코드 2** (개선)  
처리시간 24ms
```py
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        def dfs(index, path):
            if len(path) == len(digits):
                result.append(path)
                return

            for i in range(index, len(digits)):
                for j in dic[digits[i]]:
                    dfs(i + 1, path + j)

        if not digits:
            return []

        dic = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
               "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        result = []
        dfs(0, "")

        return result
```

## 3. 피드백

이번에는 **코드 2**가 **코드 1**보다 훨씬 깔끔하고 직관적으로 보입니다. 처리 시간은 둘 다 재귀를 사용하여 비슷하지만, **코드 2**가 좀 더 빠른 모습을 보여줍니다. 두 코드의 차이점을 짚자면 다음과 같습니다.  

- 그래프 딕셔너리 `graph_dict` 유무

이번 문제는 기본적으로 **DFS**를 사용합니다. 필자는 여기서 **그래프**에 집중한 나머지, `graph_dict`가 필수라고 생각했습니다. 하지만 결과적으로 이는 필요하지 않았고, 코드를 복잡하게만 만들었습니다.  
\
**코드 1**의 구체적인 알고리즘을 정리하면 다음과 같습니다.  

1. `digits`를 순회하며 각 문자(정점)에서 갈 수 있는 다음 문자(정점)를 정리한다.  
2. 이때, 순서만 다른 문자(정점)가 반복되는 경우를 피하기 위해 `str(i)+`를 붙인다.  
   ex. "22"에서 첫 번째 2와 두 번째 2는 다른 문자(정점)
3. 최초 시작은 `@`로 지정해 주고, 마지막 답에서는 제외한다.  
4. 각 문자(정점)에 대해 가능한 모든 문자(정점)를 DFS로 탐색한다.  
\
위의 방법은 모든 문자를 **그래프로 한번 만들어준 후** DFS로 풀기 때문에, 불필요한 연산이나 2번과 같이 중복 문제가 발생합니다.  
\
**코드 2**는 이러한 문제점을 다음과 같이 해결합니다.  
1. `digits`를 DFS로 탐색하되, index를 줌으로써 **코드 1**과 같이 중복문제가 발생하지 않는다.  
2. `graph_dict`를 만들지 않고 바로 재귀를 적용하며, 백트래킹으로 `path`를 리턴한다.
\
이번 문제로 느낀 점은 **한 가지 방법에 사로잡히는 순간 더 쉬운 길을 찾지 못한다** 입니다.  
그래프로 정리한다는 생각에 사로잡힌 나머지 순차적으로 중복 없이 DFS를 할 수 있다는 점을 알지 못한 것처럼 말입니다. 앞으로는 **먼저** 생각났다고 해서 바로 적용하거나 가장 확실하다고 넘겨짚지 않도록 해야겠습니다. 

## 4. 요약정리
`digits`를 순회하며 **DFS** 함수에 다음 문자와 경로를 전달하고 백트래킹한다.  
**먼저** 생각났다고 해서 바로 적용하거나 가장 확실하다고 넘겨짚지 않도록 하자.  

## Source

- 『파이썬 알고리즘 인터뷰』 *-박상길 지음*  
  [https://github.com/onlybooks/algorithm-interview](https://github.com/onlybooks/algorithm-interview)
- leetcode  
  [https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/](https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/)
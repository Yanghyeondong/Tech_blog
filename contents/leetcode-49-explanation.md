---
date: '2022-09-02'
title: 'Leetcode 49번 풀이'
categories: ['Algorithm','Leetcode']
summary: 'Leetcode 49번 그룹 애너그램 문제 풀이, 정렬과 딕셔너리'
thumbnail: './common/leetcode.png'
---
## 1. 문제 확인

[49. Group Anagrams](https://leetcode.com/problems/group-anagrams/)
\
**애너그램**이 동일한 문자열을 찾는 문제입니다. 리턴되는 답의 순서는 상관없는 것이 포인트입니다.

## 2. 코드

**코드 1**  
처리시간 5353ms
```py
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        sorted_word = []
        anagram_list =[]
        ans = []

        for i in range(0, len(strs)):
            sorted_word.append([strs[i], "".join(sorted(strs[i]))])
            i += 1

        for i in range(0, len(sorted_word)):
            is_find = False

            for j in range(0, len(anagram_list)):
                if sorted_word[i][1] == anagram_list[j][0]:
                    anagram_list[j][1].append(sorted_word[i][0])
                    is_find = True
                j += 1

            if not is_find:
                anagram_list.append([sorted_word[i][1], [sorted_word[i][0]]])
            i += 1

        for list in anagram_list:
            ans.append(list[1])

        return ans
```
\
**코드 2 (개선)**  
처리시간 158ms
```py
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # 존재하지 않는 key 오류 방지
        anagrams = collections.defaultdict(list)
        
        for word in strs:
            anagrams["".join(sorted(word))].append(word)

        return list(anagrams.values())
```

## 3. 피드백

이번에도 **코드 1**과 **코드 2**의 길이가 상당히 차이가 납니다. 시간은 두말할 것도 없이 압도적입니다. ~자꾸 C언어 시절을 떠올리는 게 문제인 듯합니다~.  
\
두 코드가 기본적으로 사용하는 `sorted()` 함수의 시간 복잡도는 차이가 없습니다. 그렇다면 원인은 간단합니다. **리스트**와 **딕셔너리**의 차이입니다. **코드 1**에서는 직접 2중 3중 리스트를 구현하고 순차적으로 검색합니다 -*시간복잡도 O(n)* . 하지만 **코드 2**에서는  딕셔너리를 통해 접근함으로써 훨씬 더 짧은 시간에 가능합니다 -*시간복잡도 O(1)* .  
\
여기에 추가적으로 새로 알게 된 점을 정리해보면 다음과 같습니다.   
>1.`defaultdict`를 사용하면 존재 여부 조회와 값 할당이 동시에 가능하다.  
>2.`.values()`의 리턴타입은 **dict_values**이며, `list()`를 통해 리스트로 바꿀 수 있다.  

1번의 경우 `anagrams["".join(sorted(word))].append(word)` 부분에서 원래라면 존재하지 않는 key에 대해 오류가 발생해야 합니다. 하지만 **defaultdict** 덕분에 오류가 나지 않고 기본값 `.defaultdict(list)`가 들어가면서 자동으로 완성이 됩니다.  
2번의 경우 `list(anagrams.values())` 부분에서 dict_values를 list 타입으로 바꾼 것을 확인할 수 있습니다.

## 4. 요약정리

딕셔너리의 검색, 수정은 **O(1)** 이므로 리스트의 순차적 비교 검색 **O(n)** 보다 훨씬 빠르다.  
**defaultdict**는 없는 key 값에 대해 오류가 아닌 기본값을 생성시켜준다.


## Source

- 파이썬 알고리즘 인터뷰 *-박상길 지음*
- leetcode  
  [https://leetcode.com/problems/group-anagrams/](https://leetcode.com/problems/group-anagrams/)
---
date: '2023-02-03'
title: '[SW Coaching - Week 3] Pandas Dataframe 다루기'
categories: ['Python','WebScraping','SW-Coaching']
summary: '파이썬 Web Scraping, Pandas, iloc, 람다 표현식'
thumbnail: './sw-coaching-week-3/title.png'
---

*본 포스트는 IOWA 대학 **이강표**(Kang-Pyo Lee) 박사님의 허락을 구하고 강의를 정리한 것입니다.*  
*강의 사진, 코드의 저작권은 모두 이강표 박사님께 있습니다.*


## 1. 강의 정리
~~설 연휴로 포스팅이 좀 밀렸습니다~~  
이번 강의도 실습 위주로 진행했습니다. 일부 중요점만 정리하여 알아보겠습니다.   
### dataframe 접근
우선 간단하게 import 및 불러오기를 진행합니다.  
```py
import pandas as pd
df = pd.read_csv(f"test.csv", sep="\t")
```
다음으로 인덱싱을 통해 row에 접근해 보겠습니다.  
```py
df[0] # error
```
위의 코드에서 `df[0]` 부분에서 오류가 발생합니다. dataframe에서 특정 row를 불러오기 위해서는 다음과 같은 예시처럼 작성해야 합니다. 즉, 범위 인덱싱만 가능한 것입니다.  
```py
df[0:1]
df[:-1]
df[1:]
```
\
다음으로 특정 column 의 데이터를 불러오는 경우입니다.  
예시로 `text`라는 column의 0번째 데이터를 불러와보겠습니다. 
```py
df["text"][0]
```
반대로 작성할 경우 작동하지 않습니다.  
```py
df[0]["text"] # error
```
\
다음으로 `.iloc()`을 이용한 접근입니다.  
```py
df.iloc[0]
```
위의 코드는 `df[0]`와 다르게 오류가 나지 않으며, 0번째 row가 잘 출력됩니다.  
`.iloc()`의 경우 row와 column의 동시 접근이 가능합니다.  
```py
df.iloc[-3:, -2:] # Return the last 3 rows in the last 2 columns
```
조건을 다는 것도 가능합니다.  
```py
df[df.retweet_count > 5000]  # rows with its retweet_count larger than 5000
```
\
마지막으로 반복문을 통한 row 출력입니다.  
```py
for idx, row in df2.iterrows():
    sid = row.status_id
    text = row.text
    print(f"[{idx}]\nsid: {sid}\ntext: {text}\n")
```


### dataframe 수정

현재 dataframe에 새로운 column이나 데이터를 만드는 법을 알아보겠습니다.  

```py
df["text_length"] = df.text.apply(lambda x: len(x))
```
`text_length`라는 column을 새로 만듭니다. 이때 각 row의 내용은 `text` column의 내용을 불러온 후 람다 표현식을 통해 길이를 계산하여 채웁니다.  
\
다음과 같이 dataframe 전체를 불러올 수도 있습니다.  
```py
df["text_detailed"] = df.apply(lambda x: f"[{x.created_at}] {x.text}", axis=1)
```
\
string의 경우, 굳이 람다식을 사용하지 않더라도 다음과 같은 기능을 활용할 수 있습니다.  
```py
df["text_splits"] = df.text.str.split()
df["text_nospace"] = df.text.str.replace(" ", "_")
df["mention_covid"] = df.text.str.contains("covid", case=False)
df["num_hashtags"] = df.text.str.count("#")
```
### dataframe 저장

수정하거나 새로 만든 dataframe은 다음과 같이 저장할 수 있습니다.  
```py
# text 부분만 csv로 저장
df.text.to_csv(f"{outcome_folder}/timeline_copy.csv", index=False)
# 전체 dataframe을 csv로 저장
df.to_csv(f"{outcome_folder}/timeline_copy1.csv", sep="\t", index=False)
```

## 2. 코드 코칭
*코드 전문은 분량상 제외하였으며, 피드백 위주로 정리하였습니다. Colab 환경을 기반으로 합니다.*  

### 함수 최적화
dataframe이 클수록 적용시키는 함수 하나하나의 최적화에 따라 사용 시간이 크게 변합니다. 예를 들어 아래의 코드는  간단히 람다 함수를 사용하기 위해 `split()`를 2번 시행합니다.
```py
%time df["first_last_token"] = df.text.apply(lambda x: (x.split()[0], x.split()[-1]))
# CPU times: user 14.7 ms, sys: 941 µs, total: 15.7 ms Wall time: 19.5 ms
```
하지만 이를 다음 코드처럼 새 함수를 만들어 `split()`을 한 번만 사용한다면 시간을 절반으로 절약할 수 있습니다.  
```py
def get_token(x :str)-> tuple:
    splited = x.split()
    return(splited[0], splited[-1])

%time df["first_last_token"] = df.text.apply(lambda x: get_token(x))
# CPU times: user 5.92 ms, sys: 1.94 ms, total: 7.86 ms Wall time: 8.05 ms
```
### [] 접근 vs . 접근
dataframe의 특정 column에 접근할 때 다음과 같이 `[]` 뿐만 아니라 `.`으로 접근이 가능합니다.  
```py
df["text"]
df.text
```
하지만, 새로운 column을 만들 때는 `.`이 작동하지 않습니다. 꼭 `[]`를 사용하여야 합니다.  
```py
df["text_shortened"] = df.text.apply(lambda x: x[:30] + "...")
df.text_shortened = df.text.apply(lambda x: x[:30] + "...") # error
```

## 3. 느낀 점
지금까지 Web scraping으로 ~~힘들게~~ 수집한 데이터들을 직접 수정하고 확인해 보는 시간이었습니다. 수많은 데이터를 이토록 쉽고 빠르게 다루는 pandas가 새삼 대단하게 느껴졌습니다. 다음 시간에 배우는 클러스터링과 토픽 모델링으로 좀 더 깊은 분석을 하는 순간이 기다려집니다. 😎


## Source
- 성균관대학교 SW Coaching 프로그램  
- 이강표(Kang-Pyo Lee) 박사님 강의  

<!--
1주 Web Scraping 기초
2주 Web Scraping 심화
3주 Pandas Dataframe 다루기
4주 텍스트 데이터 처리
5주 문서 클러스터링 및 토픽 모델링
6주 개인 프로젝트 발표
-->
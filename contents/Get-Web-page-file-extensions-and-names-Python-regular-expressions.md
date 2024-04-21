---
date: '2023-01-05'
title: '파이썬 정규식 + 파일 확장자 = 웹페이지 파일 이름 가져오기'
categories: ['Python','Tip','WebScraping']
summary: 'Web Scraping, 정규식 표현 사용법 [] $ \w + (), jpg 확장자 사진 이름 가져오기'
thumbnail: './common/code_img/img_3.jpg'
---
## 1. 미리 보는 결론
- `file_name = re.findall("/([\w]+\.jpg$", url)[0]`
- `file_name = re.search("/([\w]+\.jpg$", url).group(1)`
- `file_name = re.findall("/([\w]+\.(?:(?:jpg)|(?:png)))$", url)[0]`
- `file_name = re.search("/([\w]+\.(?:(?:jpg)|(?:png)))$", url).group(1)`
- 확장자는 원하는 대로 변경가능합니다. 밑의 2줄은 **복수**의 확장자를 지원합니다.

## 2. 문제 인식
Web Scraping을 하다 보면 웹페이지 주소 마지막에 있는 사진 파일이 필요한 경우가 있습니다.  
[https://global.unitednations.entermediadb.net/…/image1170x530cropped.jpg](https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/16-01-2020-ZIM_20191203_WFP-Matteo_Cosorich_9596.jpg/image1170x530cropped.jpg)  
\
해당 주소에서 사진 파일 이름만 가져오고 싶을 때, 보통 파이썬 문자열을 활용하여 추출하는 경우가 많습니다.
하지만 **정규식**을 이용하면 훨씬 더 직관적이고 간단하게 추출이 가능합니다.  
\
예를 들어 위의 링크에서 맨 마지막 `/` 뒤의 `image1170x530cropped.jpg` 부분을 가져오는 정규식은 다음과 같습니다.  

```py
file_name = re.findall("/([\w]+\.(?:(?:jpg)|(?:png)))$", url)[0]
```

## 3. 설명
앞에서부터 하나씩 분석해 보겠습니다.  
1. `/` 는 웹페이지 주소에서 제일 마지막 `/`를 의미합니다. **8번**과 연계됩니다.
2. 가장 바깥 `()`는 **그룹**이자 **캡처**를 의미합니다. `findall` 함수의 리턴 범위를 지정합니다.
3. `[\w]`는 영문자와 숫자 그리고 밑줄 문자를 의미하며 다음과 같습니다. `[A-Za-z0-9_]`
4. `+` 는 앞선 `[\w]`가 최소 한번 이상 반복되는 모든 문자열을 포함합니다.
5. `\.`는 메타 문자 `.`이 아닌 일반 문자 `.`을 나타냅니다. `[.]`과 동일합니다.
6. `(?:)`는 **비캡처 그룹화**입니다. 캡처하지 않으므로 리턴에 포함되지 않습니다.
7. `(?:jpg)|(?:png)`는 `jpg` 나 `png` 두 그룹 중 하나라도 나오는지 확인합니다.
8. `$`는 `url` 문자열의 **맨 마지막**에서 정규식을 찾는다는 표현입니다. **1번**과 연계됩니다.
\
`(?:jpg)|(?:png)` 부분은 얼마든지 다른 확장자로 대체하거나 수를 더 늘릴 수도 있습니다.  
코드 마지막의 `[0]`는 `re.findall()`함수 때문에 사용하였으며, `re.search()`를 사용할 경우 `.group(1)`을 붙이면 됩니다.

## Source

- wikidocs *08-2 정규 표현식 시작하기*  
  [https://wikidocs.net/4308](https://wikidocs.net/4308)

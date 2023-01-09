---
date: '2023-01-09'
title: '[SW Coaching - Week 2] Web Scraping 심화'
categories: ['Python','Web Scraping','SW Coaching']
summary: '파이썬 Web Scraping, html 및 csv로 저장, time.sleep() 위치'
thumbnail: './sw-coaching-week-2/title.png'
---

*본 포스트는 IOWA 대학 **이강표**(Kang-Pyo Lee) 박사님의 허락을 구하고 강의를 정리한 것입니다.*  
*강의 사진, 코드의 저작권은 모두 이강표 박사님께 있습니다.*


## 1. 강의 정리
이번 강의는 이론보다는 실습 위주로 진행했습니다. 일부 중요점만 정리하여 알아보겠습니다.   

### urls로 html 가져오기
웹페이지에서 **features** 같이 여러 페이지가 목록화되어있는 페이지를 찾습니다.  
해당 페이지에서 각 **url**을 추출한 다음 이를 바탕으로 **html** 파일을 불러오고 저장합니다.  
```py
urls = ["https://fivethirtyeight.com/features/"]

# The range(2, 11) generates a list of integers from 2 to 10.
for i in range(2, 11):
    url = f"https://fivethirtyeight.com/features/page/{i}/"
    urls.append(url)

for url in urls:
    print(url)

    # Get the content of a pag
    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html.parser")

    # Get the list of article
    h2_list = soup.find_all("h2", {"class": "article-title entry-title"})
    
    for h2 in h2_list:
        # Find the anchor tag
        a = h2.find("a")
        
        # Extract the title & URL of an article
        title = a.text
        article_url = a["href"]
        
        # Fetch the content and save it as an HTML file
        print("- " + article_url + ": processing...")
        
        r2 = requests.get(article_url)
                
        if "/features/" in article_url:
          file_name = article_url[len("https://fivethirtyeight.com/features/"):-1] + ".html"
        elif "/videos/" in article_url:
          file_name = article_url[len("https://fivethirtyeight.com/videos/"):-1] + ".html"
        elif "/methodology/" in article_url:
          file_name = article_url[len("https://fivethirtyeight.com/methodology/"):-1] + ".html"
        elif "/live-blog/" in article_url:
          file_name = article_url[len("https://fivethirtyeight.com/live-blog/"):-1] + ".html"
        else:
          assert 0 == 1, "Unknown article url pattern!"

        with open(f"{outcome_folder}/HTMLs/{file_name}", "w+b") as fw:
            fw.write(r2.content)
        
        print("- " + file_name + ": saved.")
        
        # Sleep for a second to not overload the web site
        time.sleep(1)
```
html 파일을 **저장**하는 이유  
= 웹페이지 파일은 언제든지 바뀔 수 있기 때문에  
\
`article_url[len("https://fivethirtyeight.com/live-blog/"):-1]`  
= 웹 사이트에서 해당 포스트의 이름만 가져오기 위해  
= url 패턴을 분류하기 위해  
\
`time.sleep(1)`  
= **politeness policy**를 지키기 위해

### csv 파일로 저장  

다운받은 **html** 파일에서 필요한 자료 **file_name, article_title, article_author** 만 추출하여 **csv** 파일을 만듭니다.  
```py
with open(f"{outcome_folder}/html_metadata.csv", "w") as fw:
    # Column names on the first row
    fw.write("file_name\tarticle_title\tarticle_author\n")

    for file_name in os.listdir(f"{outcome_folder}/HTMLs"):
        if not file_name.endswith(".html"):
            continue
        
        # Column values starting from the second row
        with open(f"{outcome_folder}/HTMLs/{file_name}", "r+b") as fr:
            print(file_name)
            soup = BeautifulSoup(fr.read(), "html.parser")
            
            # No title exception handling
            if soup.find("h1", {"class": "article-title article-title-single entry-title"}) == None:
                article_title = ""
            else:
                article_title = soup.find("h1", {"class": "article-title article-title-single entry-title"}).text.strip()
            
            # No author exception handling
            if soup.find("a", {"class": "author url fn"}) == None:
                article_author = ""
            else:
                article_author = soup.find("a", {"class": "author url fn"}).text
            
            # Remove all possible tabs
            article_title = article_title.replace("\t", "")
            article_aurthor = article_author.replace("\t", "")
                        
            fw.write(f"{file_name}\t{article_title}\t{article_author}\n")
```

`\t`을 사용하는 이유  
= article_title에 `,`가 있을 수도 있으므로 기본 구분자를 `\t`로 대체합니다.  
\
`if soup.find("a", {"class": "author url fn"}) == None:`  
= article_author가 없는 경우를 확인합니다.  article_title도 동일합니다.  

## 2. 코드 코칭
*코드 전문은 분량상 제외하였으며, 피드백 위주로 정리하였습니다. Colab 환경을 기반으로 합니다.*  
### hierarchy 사용 기준
아래의 웹사이트에서 포스트의 excerpt, author를 불러오는 코드를 다음과 같이 작성할 수 있습니다.  
[https://www.kdnuggets.com/2021/05/top-programming-languages.html](https://www.kdnuggets.com/2021/05/top-programming-languages.html)  
**코드 1**
```py
ans2_1 = soup.find("div", attrs={"class": "post-header-has-award"}).find("p", attrs={"class": "excerpt"}).text.strip()
ans2_2 = soup.find("div", attrs={"class": "author-link"}).find("a", attrs={"rel": "author"}).text.strip()
```
**코드 2**
```py
ans2_1 = soup.find("p", attrs={"class": "excerpt"}).text.strip()
ans2_2 = soup.find("a", attrs={"rel": "author"}).text.strip()
```
**코드 1**의 경우 hierarchy를 의식해서 부모의 class를 지정해 주었지만, 찾고자 하는 대상의 element나 attrs가 정확하다면 **굳이 hierarchy를 고집할 필요는 없습니다**. 따라서 **코드 2**가 더 바람직하다고 할 수 있습니다.

### 필요한 사진 경로만 불러오기
웹사이트에서 본문의 사진을 불러오면 아래처럼 나옵니다.  
```py
imgs = soup.find("div", attrs={"id": "post-"}).find_all("img")

for img in imgs:
    print(img["src"])
```
```py
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201000%200'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20271%20262'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_Python_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20263%20297'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_JavaScript_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20199%20264'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_Java_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20350%20271'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_R_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20350%20168'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_C_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20216%20297'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_Go_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20284%20313'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_Csharp_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20350%20196'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_PHP_top-programming-languages.jpg
data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20313%20313'%3E%3C/svg%3E
https://www.kdnuggets.com/wp-content/uploads/Costa_Swift_top-programming-languages.jpg
```
이 중에서 우리가 원하는 것은 `.endswith()`으로 매우 간단히 추출할 수 있습니다.  
```py
for img in img_list: 
    if not img["src"].endswith(".jpg"): 
        continue 
    print(img["src"]) 
```
```py
https://www.kdnuggets.com/wp-content/uploads/Costa_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_Python_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_JavaScript_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_Java_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_R_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_C_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_Go_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_Csharp_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_PHP_top-programming-languages.jpg
https://www.kdnuggets.com/wp-content/uploads/Costa_Swift_top-programming-languages.jpg
```

### time.sleep()의 위치
다음 WHO 웹페이지 목록에서 필요한 정보(제목, url)를 추출해서 csv로 저장하는 코드입니다.  
[https://www.who.int/news-room/releases/1/](https://www.who.int/news-room/releases/1/)
```py
import time
import os

urls = []

for i in range(1, 6):
    url = f"https://www.who.int/news-room/releases/{i}/"
    urls.append(url)

with open(f"{outcome_folder}/hw2_output.csv", "w") as fw:
    fw.write("title\turl\n")

    for url in urls:
        r = requests.get(url)
        soup3 = BeautifulSoup(r.content, "html.parser")
        a_list = soup3.find("div", attrs={"class": "list-view vertical-list vertical-list--image"}).find_all("a", attrs={"class": "link-container table"})
        
        for a in a_list:
            
            title = a.find("p", attrs={"class": "heading text-underline"}).text.replace("\n", " ").replace("\r", " ").strip()
            url = "https://www.who.int"+a["href"]
            fw.write(f"{title}\t{url}\n")

        time.sleep(1)
```

여기서 `time.sleep()`의 위치가 중첩 반복문의 어느 위치에 있는지 주의해야 합니다. 내부 반복문은 한 페이지 내에서 element를 찾는 것이므로 `time.sleep()`가 필요하지 않습니다. 따라서 새로 페이지를 request 하는 바깥 반복문에 위치하여야 합니다.  
- `time.sleep()` 의 위치 == `requests.get(url)` 의 위치  

## 3. 느낀 점
저번주에 이어 **Web scraping**에 대해 많은 것을 배운 좋은 시간이었습니다. 단순히 배우고 과제를 하는 것에 그치지 않고, 개인 프로젝트의 윤곽을 잡으면서 스스로 공부를 더 해나가도록 노력하는 중입니다 😊.


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
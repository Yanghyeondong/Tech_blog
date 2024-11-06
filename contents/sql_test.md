---
date: '2024-11-06'
title: 'SQL 실전 압축 정리본'
categories: ['Tip','SQL']
summary: '최근 기업 코딩테스트에서 자주 등장하는 SQL 문법과 개념을 정리합니다.'
thumbnail: './common/sql.png'
---


최근 여러 기업의 코딩테스트를 준비하다 보니, SQL도 준비할 필요를 느꼈습니다!  
여러 블로그와 사이트를 찾으며 모은 정보를 다음과 같이 공유합니다. 😎  
참고 블로그 출처는 아래 Source를 확인하세요!

### 기본 SELECT
```sql

-- 가독성을 위해 각 문법의 내용을 모두 합쳤습니다.
-- 아래 질의문 통째로는 사용하지 않습니다!

SELECT 
    *                                   -- 모든 요소
    price, bookname                     -- 특정요소
    price AS p                          -- 이름 변경, 공백 또는 특수 문자 포함시 "" 넣어주면 됨.
    price p                             -- 생략 가능
    DISTINCT publisher                  -- 중복 비허용
    SUM(price)                          -- 집계 함수
    AVG() COUNT() MAX() MIN()           -- 그룹 없이도 사용가능
    UPPER(bookname) LOWER(bookname)     -- 대소문자
    SUBSTR(city, 1, 3)                  -- 3번째 글자까지
    CONCAT(a, b)                        -- 2개 연결
    ROUND(AVG(price),0)                 -- 소수 첫 번째 자리에서 반올림
    -- DATE_OF_BIRTH 를 "%Y(소문자의 경우 뒤에 두글자)-%m(대문자의 경우 영어)-%d(대문자의 경우 th)" 형태로
    DATE_FORMAT(DATE_OF_BIRTH, '%Y-%m-%d') DATE_OF_BIRTH  


    -- GROUP BY의 경우
    custid, COUNT(*) AS total_c, SUM(price) AS total_p -- custid(고객) 마다 구매 총 갯수, 합계 금액
    custid, SUM(discount*price) AS total_p             -- 집계함수 내 연산 가능
    -- ONLY_FULL_GROUP_BY 활성화시 오류 발생! GROUP_BY가 아닌 컬럼 price가 포함되어서
    -- ONLY_FULL_GROUP_BY 비활성시 임의의 값 반환. 대부분 그룹 내 첫번째 행 값
    custid, price                                      

 
FROM Book b                             -- 약칭 사용 가능

WHERE -- GROUP BY 이전에 적용
    price < 20000                       -- =, <>(!=), <, <=, >, >= 사용 가능
    price IN (10000, 20000, 30000)      -- (a = b) OR의 연속
    bookname LIKE '파이썬 입문'          -- '파이썬 입문' 와 동일한 값.
    bookname = '파이썬 입문'
    WHERE bookname LIKE '%자바%';       -- 특정 단어를 포함하는 경우
    bookname LIKE '_바%'                -- 왼쪽 두 번째 위치에 ‘바’라는 문자열을 갖는 경우
    price IS NULL
    price IS NOT NULL
    (price < 20000) AND (bookname LIKE '파이썬 입문')
    MONTH(DATE_OF_BIRTH) = 3            -- DATE_OF_BIRTH 의 월이 3인 경우
    YEAR(), DAY(), HOUR(), MINUTE(), SECOND(), WEEK()

    -- 서브 쿼리
    price > (SELECT MAX(price) FROM Book WHERE bookname LIKE '파이썬 입문')
    SELECT * FROM (SELECT column1 FROM table1) AS sub_table;    -- 별칭 설정해주기

GROUP BY
    -- GROUP BY 로 묶고 그냥 출력하면 마지막 것만 남는다. 마치 DISTINCT 처럼 작동.
    custid
    o.USER_ID, o.PRODUCT_ID             -- 2개를 기준으로 묶기도 가능!

HAVING -- GROUP BY 이후에 적용
    count(*) >= 2                       -- custid(고객)중 row(구매한 도서)가 2개 이상인 경우

ORDER BY 
    price DESC, publisher ASC;          -- 내림차순 price, 오름차순 publisher

LIMIT
    10                                  -- 상위 10개만 조회
    2 OFFSET 3                          -- 3번째 데이터부터 2건만 조회
;                                       -- 마지막에 세미콜론 권장
```

### JOIN
```sql
-- where 기반 간단 join
SELECT b.name country_name, a.language, a.isofficial, a.percentage
FROM countrylanguage a, country b
WHERE a.countrycode = b.code AND a.countrycode = 'KOR'  -- 단일 인용부호''는 문자열

-- INNER JOIN
SELECT B.mem_id, M.addr                  -- mem_id 를 select 할시 오류 발생. 어느 mem_id인지 모름
FROM buy B
INNER JOIN member M
    ON B.mem_id = M.mem_id
WHERE B.mem_id = 'GRL'

-- OUTER JOIN
-- 두 테이블 중 한쪽에만 있는것도 출력하고 싶을때
SELECT M.mem_id, M.mem_name, B.prod_name, M.addr
-- LEFT 테이블
FROM member M           
-- RIGHT 테이블. LEFT RIGHT는 테이블 순서만 바꾸면 된다. FULL은 전부
LEFT OUTER JOIN buy B                   -- LEFT에 있는건 모두 나오도록 함. 없는 값에 대해서는 NULL
    ON B.mem_id = M.mem_id
ORDER BY M.mem_id

-- CROSS JOIN : 카테시안 곱, 대용량 데이터를 만들때 사용함. 조건 없는 INNER와 동일

-- SELF JOIN : 조직도 등을 위해 설정
SELECT A.emp "직원", B.emp "직속상관", B.phone "상관연락처"                  -- mem_id 를 select 할시 오류 발생. 어느 mem_id인지 모름
FROM emp_table A
INNER JOIN emp_table B
    ON A.manager = B.emp
WHERE A.emp = '경리부장'                -- 이중 인용부호 "" 는 식별자

```

### UNION
```sql
-- 서브쿼리로 활용 가능
(SELECT cost AS price FROM books1   -- 컬럼값을 동일하게 해준다. 서로 컬럼 갯수가 다르면 오류, 이름이 다르면 앞선거 기준
UNION                               -- UNION DISTINCT과 동일. 중복 비허용. 중복 허용은 UNION ALL
SELECT price FROM books2)
```

### 비트연산
```sql
-- A개발자 = 9    Python(1), C++(8)
-- B개발자 = 3    Python(1), C#(2)
-- C개발자 = 6    C#(2), 국어(4)
-- D개발자 = 8    C++(8)

-- & 2의 경우, C#를 사용가능한 개발자는 0보다 큰 정수 가 결과 값으로 나온다.
-- A개발자(9) & 2 = 1001 & 0010 = 0000 = 0
-- B개발자(3) & 2 = 0011 & 0010 = 0010 = 3
-- C개발자(6) & 2 = 0110 & 0010 = 0010 = 2
-- D개발자(8) & 2 = 1000 & 0010 = 0000 = 0

-- & 3(Python(1), C#(2))의 경우, Python or C# 하나라도 사용가능한 개발자는 0보다 큰 정수 가 결과 값으로 나온다
-- A개발자(9) & 3 = 1001 & 0011 = 0001 = 1
-- B개발자(3) & 3 = 0011 & 0011 = 0011 = 3
-- C개발자(6) & 3 = 0110 & 0011 = 0010 = 2
-- D개발자(8) & 3 = 1000 & 0011 = 0000 = 0

SELECT DISTINCT d.ID, d.EMAIL, d.FIRST_NAME, d.LAST_NAME    --둘 다 쓸줄 알면 id당 두줄이 되므로, 하나로 줄인다.
FROM DEVELOPERS d
JOIN SKILLCODES s
    ON ((d.SKILL_CODE & (s.CODE)) > 0) and ((s.NAME = 'Python') or (s.NAME = 'C#'))
ORDER BY d.ID
```

## Source

- 『MySQL - SQL 기본 문법 정리 - (SELECT, WHERE, ORDER BY ..)』 *-rachel0115*  
  [https://rachel0115.tistory.com/entry/SQL-%EA%B8%B0%EB%B3%B8-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC-SELECT-%EC%A0%88](https://rachel0115.tistory.com/entry/SQL-%EA%B8%B0%EB%B3%B8-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC-SELECT-%EC%A0%88)

- 『SQL 기본문법 정리』 *-jake*  
  [https://velog.io/@tlsdnxkr/SQL-%EA%B8%B0%EB%B3%B8%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC](https://velog.io/@tlsdnxkr/SQL-%EA%B8%B0%EB%B3%B8%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC)

- 『FROM과 WHERE 절로 내부 조인하기』 *-더북(TheBook)*  
  [https://thebook.io/080268/0304/](https://thebook.io/080268/0304/)

- 『10강. 두 테이블을 묶는 JOIN』 *-한빛미디어*  
  [https://www.youtube.com/watch?v=tuQFkzjqEGw](https://www.youtube.com/watch?v=tuQFkzjqEGw)

- 『비트연산자(&)』 *-whtjd999*  
  [https://velog.io/@whtjd999/SQL-%EB%B9%84%ED%8A%B8%EC%97%B0%EC%82%B0%EC%9E%90](https://velog.io/@whtjd999/SQL-%EB%B9%84%ED%8A%B8%EC%97%B0%EC%82%B0%EC%9E%90)
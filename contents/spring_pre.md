---
date: '2024-02-06'
title: 'Spring 입문 정리'
categories: ['Back-end']
summary: 'Spring을 배우기전, Spring에 대한 간단한 개념을 정리합니다.'
thumbnail: './common/spring.png'
---
*본 포스트는 [스프링과 스프링부트(Spring Boot)](https://www.codestates.com/blog/content/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8) 글을 참고하였습니다.*

## 0. Spring을 배우는 이유
이번에 학교 졸업 작품 [DEV-ROOM](https://github.com/Yanghyeondong/DEV-ROOM) 을 진행하면서 spring을 백엔드 서버로 활용하게 되었습니다. 이에 간단하게 spring을 배우기 전, spring의 정의나 개념을
알아보려고 합니다.👀

## 1. 스프링 정의

> 엔터프라이즈용 Java 애플리케이션 개발을 편하게 할 수 있게 해주는 오픈소스 경량급 애플리케이션 프레임워크
개발자로 하여금 기본적인 설정과 적용 기술을 제공하여 애플리케이션 로직 개발을 더욱 편리하게 만들어 준다. 이전의 기술에 비해 비즈니스 로직에 대한 부담이 줄어든다.  

오픈소스이면서, SpringSource 기업에서 관리하기에 프레임워크가 안정적이다.  

기존의 EJB(Enterprise Java Bean) 등에 비해 코드의 복잡성이 줄어들어 개발자의 코드 작성 부담을 줄였다.  

### TIP
#### 프레임워크:
어떠한 목적을 쉽게 달성할 수 있도록 해당 목적과 관련된 코드의 뼈대를 미리 만들어둔 것

## 2. 스프링 특징
### POJO(Plain Old Java Object) 프로그래밍  
순수 Java만으로 생성한 객체를 활용한다(외부 라이브러리나 모듈을 객체에서 사용하지 않음). 이를 통해 외부의 특정 기술이나 환경에 종속되지 않아 더 유연하다.

### IoC (Inversion of Control, 제어의 역전) DI (Dependency Injection, 의존성 주입)
개발자가 아닌 스프링이 설정 클래스 파일을 활용하여 객체를 생성, 의존 관계를 맺고 생성자로 주입해준다.
ex.) A라는 클래스가 i라는 객체를 의존 관계로 사용할때, 사용할 객체를 개발자가 클래스 파일에서 B로 정해주면 Spring이 알아서 B 객체를 생성하여 전달한다.

### AOP(Aspect Oriented Programming)
공통 관심 사항과 (ex. 로깅, 보안 관련) 핵심 관심 사항 (ex. 메뉴 등록, 주문 변경)을 별도의 객체로 분리하고 메서드를 통해 공통 관심 사항를 실행한다. 이를 통해 코드의 중복을 줄이고 재사용성을 높인다.

### PSA (Portable Service Abstraction, 일관된 서비스 추상화)
특정 기술과 관련된 서비스를 추상화하여 일관된 방식으로 사용될 수 있도록 한 것.
ex.) db 회사들이 db에 접근하는 드라이버를 Java 코드의 형태로 배포하고, 이를 통해 JDBC(Java DataBase Connectivity)를 구현하여 db의 변경에도 유연하게 대처.

## Spring Boot
Spring으로 애플리케이션을 만들 때에 필요한 설정을 간편하게 처리해주는 별도의 프레임워크. 자체 웹 서버를 포함하고 있다.

## Source

- 스프링과 스프링부트(Spring Boot)ㅣ정의, 특징, 사용 이유, 생성 방법  
  [https://www.codestates.com/blog/content/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8](https://www.codestates.com/blog/content/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8)

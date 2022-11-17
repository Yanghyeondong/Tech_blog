import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import { Link } from 'gatsby';

type IntroductionProps = {
  profileImage: IGatsbyImageData
}

const Background = styled.div`
  height: 55vh;
  width: 100%;
  color: #ffffff;
  background-color: #433F49;
  background-color: #433E49;
  @media (max-width: 768px) {
    height: 65vh;
  }
`
const Cocktail = styled.div`
  width: 35.2vh;
  height: 35.2vh;
  background-image: url('cocktail_ice_mini_logo.webp');
  //background-image: url('cocktail_ice_low.png');
  background-size: contain;
  position: relative;
  z-index: 2;
`
const Wave = styled.div`

  width: 35vh;
  height: 35vh;
  z-index: 1;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-left: 3vh;
  }

  .wave {
    position: absolute;
    background: #4ccd97;
    width: 35vh;
    height: 35vh;
    top: 250vh;
    left: -6vh;
    transform-origin: 50% 50%;
    border-radius: 40% 45% 40% 45% / 45% 40% 45% 40%;
    animation: 
    fix 8000ms 1 step-end forwards,
    up 6500ms 1500ms 1 linear forwards, 
    rotate 2500ms 3 linear;
  }

  @keyframes fix {
    0% { 
      width: 35vh; 
      height: 35vh;
    }
    100% { 
      width: 25vh; 
      height: 25vh;
      left: 1vh;
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    from { transform: rotate(360deg); }
  }

  @keyframes up {
    0% { top: 35vh; }
    100% { top: 7vh; }
  }
`

const Wrapper = styled.div`
  text-align:right;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 55vh;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top:50px;
    text-align:center;
  }
`

const TitleWrapper = styled.div`
  @media (max-width: 768px) {
    margin: 10px auto;
  }
`

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-left: 0px;
  background-color:transparent;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 5px;
    margin-left: 0px;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 15px;
  }
`
const SubTitleSmall = styled(SubTitle)`
  @media (max-height: 650px) {
    display: none;
  }
`

const Title = styled.div`

  font-size: 34px;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 0px;
    margin-left: 0px;
    display: inline-block;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 24px;
  }
`
const TitleColor = styled(Title)`

  font-size: 45px;
  font-weight: 800;
  color: #4ccd97;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    margin-top: 0px;
    font-size: 32px;
    margin-left: 0px;
    margin-bottom: 10px;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 32px;
  }
`
/*
const AboutMe = styled(Link)`
  font-size: 18px;
  padding: 3px 6px;
  border-radius: 5px;
  font-weight: 600;
  border: 1px solid #4ccd97;
  transition: 500ms;
	&:hover {
		color: #ffffff;
    background-color: #4ccd97;
	}
  @media (max-width: 768px) {
    font-size: 14px;
    display: block;
    width: 70px;
    margin: auto;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 14px;
  }
`
*/

const Introduction: FunctionComponent<IntroductionProps> = function () {
  return (
    <Background>
      <Wrapper>
        <Wave>
          <Cocktail>
          </Cocktail>
          <span className="wave"></span>
        </Wave>
        <TitleWrapper>
          <SubTitle>프로그래밍에서 컴퓨터 한잔,</SubTitle>
          <SubTitleSmall>부담없이 편안한 마음으로 누구나</SubTitleSmall>
          <Title>Hyeondong</Title>
          <TitleColor>Yang</TitleColor>
          {/* <AboutMe to="/about/">about</AboutMe> */}
        </TitleWrapper>
      </Wrapper>
    </Background>
  )
}

export default Introduction
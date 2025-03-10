import React, { FunctionComponent, useEffect } from 'react'
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
    height: 62vh;
  }
`
const Cocktail = styled.div`
  width: 35.2vh;
  height: 35.2vh;
  background-image: url('cocktail_ice_mini_logo3.webp');
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
    border-radius: 40% 55% 40% 55% / 55% 40% 55% 40%;
    animation: 
    up 3500ms 500ms linear forwards, 
    rotate 2500ms 2 linear;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    from { transform: rotate(360deg); }
  }

  @keyframes up {
    0% { top: 30vh; }
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
    margin-top:30px;
    height: 58vh;
    text-align:center;
  }
`

const TitleWrapper = styled.div`
  margin-right: 30px;
  @media (max-width: 768px) {
    margin: 10px auto;
  }
`

const SubTitle = styled.div`
  font-size: 22px;
  font-weight: 300;
  margin-left: 0px;
  background-color:transparent;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    font-size: 15px;
    margin-top: 0px;
    margin-bottom: 3px;
    margin-left: 0px;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 18px;
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
    font-size: 28px;
  }
`
const TitleColor = styled(Title)`
  position: relative;
  top: -10px;
  font-size: 45px;
  font-weight: 800;
  color: #4ccd97;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    top: -0px;
    margin-top: 0px;
    font-size: 32px;
    margin-left: 5px;
    margin-bottom: 10px;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 32px;
  }
`

const AboutMe = styled(Link)`
  font-size: 17px;
  padding: 3px 6px;
  border-radius: 5px;
  font-weight: 600;
  border: 1.5px solid #4ccd97;
  transition: 500ms;
	&:hover {
		color: #ffffff;
    background-color: #4ccd97;
	}
  @media (max-width: 768px) {
    font-size: 15px;
    display: block;
    padding: 2px 2px;
    width: 58px;
    margin: auto;
  }
  @media (min-width: 768px) and (max-height: 768px) {
    font-size: 14px;
  }
`

const Introduction: FunctionComponent<IntroductionProps> = function () {
  useEffect(() => {
    const image = new Image();
    image.src = 'cocktail_ice_mini_logo3.webp';
  }, []);

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
          <AboutMe to="https://github.com/Yanghyeondong">Github</AboutMe>
        </TitleWrapper>
      </Wrapper>
    </Background>
  )
}

export default Introduction
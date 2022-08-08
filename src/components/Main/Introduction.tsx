import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { IGatsbyImageData } from 'gatsby-plugin-image'

type IntroductionProps = {
  profileImage: IGatsbyImageData
}

const Background = styled.div`
  height: 70vh;
  width: 100%;
  color: #ffffff;
  background-color: #433E49;


`
const Cocktail = styled.div`
  width: 40.1vh;
  height: 40.1vh;
  background-image: url('cocktail_empty_ice.png');
  background-size: contain;
  overflow: hidden;
  position: relative;
  z-index: 2;
`
const Wave = styled.div`

  width: 40vh;
  height: 40vh;
  z-index: 1;
  position: relative;
  overflow: hidden;
  
  .wave {
    position: absolute;
    background: #3CB371;
    width: 27vh;
    height: 27vh;
    top: 250vh;
    transform-origin: 50% 50%;
    border-radius: 40% 43% 40% 43% / 43% 40% 43% 40%;
    animation: up 4000ms 1500ms 1 linear forwards, rotate 2000ms infinite linear;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    from { transform: rotate(360deg); }
  }

  @keyframes up {
    0% { top: 50vh; }
    100% { top: 9vh; }

`


const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 70vh;
  margin: 0 auto;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  @media (max-width: 768px) {
    margin-top: 5vh;
  }
`

const Title = styled.div`
  margin-top: 5px;
  font-size: 35px;
  font-weight: 700;
  @media (max-width: 768px) {
    margin-bottom: 5vh;
  }
`

const Introduction: FunctionComponent<IntroductionProps> = function ({
}) {
  return (
    <Background>
      <Wrapper>
      <Wave>
        <Cocktail>
        </Cocktail>
        <span className="wave"></span>
      </Wave>
      <div>
        <SubTitle>프로그래밍에서 컴퓨터 한잔</SubTitle>
        <Title>Hyeondong Yang</Title>
      </div>
      </Wrapper>
    </Background>
  )
}

export default Introduction
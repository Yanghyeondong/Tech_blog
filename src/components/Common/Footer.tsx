import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'

const FooterWrapper = styled.footer`
  display: grid;
  place-items: center;
  margin-top: auto;
  padding: 50px 0;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`

const BartenderIcon = styled.div`
  width: 100px;
  height: 100px;
  background-image: url('bartender.png');
  background-size: contain;
  margin: 20px auto;
`

const Footer: FunctionComponent = function () {
  return (
    <FooterWrapper>
      <BartenderIcon />
      Just an developer with drinks
      <br />2022 HyeonDong, Powered By Gatsby.
    </FooterWrapper>
  )
}

export default Footer
import React, { FunctionComponent, useState } from "react"
import SideBar from "components/Common/SideBar"
import styled from "@emotion/styled"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false;

const SideMenuButton = styled.div`
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background-color: #4ccd97;
  color: #ffffff;
  font-size: 40px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 30px;
    border-radius: 15px;
  }
`

const NavigatorWrapper = styled.div`
  position: fixed;
  margin: 10px 10px;
  z-index: 5;
`

const Navigator: FunctionComponent = function () {
  
  const [active, setActive] = useState(false)

  const OpenSideBar = () => {
    setActive(!active)
  }

  return (
      <NavigatorWrapper>
        <SideMenuButton onClick={OpenSideBar}>
          { active 
          ? <FontAwesomeIcon icon={faChevronLeft} /> 
          : <FontAwesomeIcon icon={faCompass} />
          }
        </SideMenuButton>
        <SideBar active={active} />
      </NavigatorWrapper>
  )
}

export default Navigator
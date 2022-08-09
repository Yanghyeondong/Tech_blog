import React, { FunctionComponent, useState } from "react"
import SideBar from "components/Common/SideMenu"
import styled from "@emotion/styled"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const SideMenuButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    font-size: 30px;
    border-radius: 20px;
    color: #ffffff;
    background-color: #4ccd97;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`

const NavigatorWrapper = styled.div`
  position: fixed;
  margin: 10px 10px;
  z-index: 5;
`

const Navigator: FunctionComponent = function () {
  
  const [active, setActive] = useState(false)

  const toggleSideMenu = () => {
    setActive(!active)
  }

  return (
      <NavigatorWrapper>
        <SideMenuButton onClick={toggleSideMenu}>
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
import React, { FunctionComponent, useState } from "react"
import SideBar from "components/Common/SideMenu"
import styled from "@emotion/styled"
import keyframes from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const SideMenuButton = styled.div`
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 20px;
  background-color: #4ccd97;
  color: #ffffff;
  font-size: 30px;
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

  const OpenSideBar = () => {
    setActive(!active)
  }

  return (
      <NavigatorWrapper>
        <SideMenuButton onClick={OpenSideBar}>
          <FontAwesomeIcon icon={faCompass} />
        </SideMenuButton>
        <SideBar active={active} />
      </NavigatorWrapper>
  )
}

export default Navigator
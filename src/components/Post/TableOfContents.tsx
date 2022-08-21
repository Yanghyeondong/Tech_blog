import styled from "@emotion/styled"
import React, { FunctionComponent } from 'react'

type TOCProps = {
  content: any
}

const TOCWrapper = styled.div`
  height: auto;
`
const TOC = styled.div`

  position: sticky;
  top: 50px;
  display: inline-block;
  margin: 120px 40px;
  margin-right: 0px;
  height: auto;
  width: 200px;
  font-size: 14.5px;
  border-left: 3px solid #4ccd97;

  @media (max-width: 1200px) {
    display: none;
  }

  li {  
    padding: 5px;
    color: gray;
  }

  ul {
    margin-left: 10px;
    list-style: none;
  }

  a:hover {
    transition: 0.3s;
    font-size: 15px;
    font-weight: 700;
    color: #433E49;
  }
`
const TableOfContents: FunctionComponent<TOCProps> = ({ content }) => {
  return (
    <TOCWrapper>
      <TOC dangerouslySetInnerHTML={{ __html: content } }
      />
    </TOCWrapper>
  )
}

export default TableOfContents
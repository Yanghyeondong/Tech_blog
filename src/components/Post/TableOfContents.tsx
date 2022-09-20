import styled from "@emotion/styled"
import React, { FunctionComponent } from 'react'

type TocProps = {
  content: any
}

const TocWrapper = styled.div`
  height: auto;
`
const Toc = styled.div`

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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 5px;
    color: gray;
  }

  ul {
    margin-left: 10px;
    padding: 7px 5px;
    list-style: none;
  }

  a:hover {
    transition: 0.3s;
    font-size: 15px;
    font-weight: 700;
    color: #433E49;
  }
`
const TableOfContents: FunctionComponent<TocProps> = ({ content }) => {
  return (
    <TocWrapper>
      <Toc dangerouslySetInnerHTML={{ __html: content } }
      />
    </TocWrapper>
  )
}

export default TableOfContents
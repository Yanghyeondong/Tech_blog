import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'

type PostContentProps = {
  html: string
}

const MarkdownRenderer = styled.div`
  // Renderer Style
  display: flex;
  flex-direction: column;
  width: 768px;
  margin: 0 auto;
  padding: 100px 0;
  word-break: break-all;

  // Markdown Style
  line-height: 2.5;
  font-size: 18px;
  font-weight: 400;

  // Apply Padding Attribute to All Elements
  p {
    padding: 3px 0;
  }

  strong {
    margin: 0px 1px;
    font-size: 18.3px;
    font-weight: 800;
  }

  // Adjust Heading Element Style
  h1,
  h2 {
    font-weight: 800;
    margin-bottom: 20px;
  }
  h3 {
    margin-bottom: 0px;
  }

  * + h1,
  * + h2,
  * + h3 {
    margin-top: 50px;
  }

  * + h4 {
    margin-top: 25px;
  }

  hr + h1,
  hr + h2,
  hr + h3 {
    margin-top: 0;
  }

  hr + h4 {
  margin-top: 25px;
  }

  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 35px;
  }

  h3 {
    font-size: 23px;
    color: #8dc123;
  }

  // Adjust Quotation Element Style
  blockquote {
    margin: 30px 10px;
    padding: 5px 15px;
    border-left: 2px solid #4ccd97;
    background-color: #f9f9f9; 
    font-weight: 400;
  }
  blockquote li{
    font-size: 18px;
    margin: 0px 15px;
    padding: 0px 10px 0px 5px;
    background-color: #f9f9f9;
  }
  blockquote ol li::Marker{
    font-weight: 800;
    color: #000;
  }

  // Adjust italic Element Style
  em{
    padding-right: 8px;
    padding-left: 3px;
  }

  // Adjust List Element Style
  ol {
    margin-left: 20px;
    padding: 5px 0;
  }
  ol li::Marker{
    font-weight: 800;
    font-size: 19px;
    color: #4ccd97;
  }
  ul {
    margin: 20px;
    margin-right: 0px;
  }
  ul li::Marker{
    content: "▶ ";
    font-weight: 800;
    color: #4ccd97;
  }
  li{
    font-size: 17px;
    margin: 10px 20px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #f9f9f9;
    border-radius: 10px;
  }
  li strong{
    font-size: 17.5px;
  }
  // Adjust del style
  del{
    text-decoration: line-through 3px solid rgba(0, 0, 0, .4);
  }

  // Adjust Horizontal Rule style
  hr {
    border: 1px solid #000000;
    margin: 100px 0;
  }

  // Adjust Link Element Style
  a {
    font-weight: 800;
    color: #4ccd97;
    text-decoration: underline 1px;
    text-underline-position: under;
  }
  a:hover {
    color: #ffffff;
    background-color: #4ccd97;
  }
  // Adjust Code Style
  pre[class*='language-'] {
    font-weight: 300;
    padding: 20px 30px;
    margin-bottom: 15px;
    font-size: 20px;
    border-radius: 10px;
    border: 1px solid #dddddd;
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  pre[class*='language-'] * {
    font-family: 'Roboto Mono', monospace;
    font-weight: 400;
  }
  code[class*='language-'] {
    font-size: 16px;
    margin-right: 4px;
  },
  :not(pre) > code[class*="language-"] {
    font-size: 15px;
    margin-right: 4px;
    margin-left: 4px;
    color: #000000;
    background-color: #fafafa;
    border: 1px solid #dddddd;
    padding: 1px 4px 3px 4px;
    border-radius: 5px;
    ::selection{
      background-color: #dadada;
    }
  }

  // Markdown Responsive Design
  @media (max-width: 768px) {
    width: 100%;
    padding: 80px 20px;
    line-height: 2.0;
    font-size: 16px;

    h1 {
      font-size: 26px;
    }

    h2 {
      font-size: 23px;
    }

    h3 {
      font-size: 20px;
    }

    strong {
      margin: 0px 3px;
      font-size: 17px;
      font-weight: 800;
    }

    img {
      width: 100%;
    }

    hr {
      margin: 50px 0;
    }

    li{
      font-size: 16px;
    }
  }
`

const PostContent: FunctionComponent<PostContentProps> = function ({ html }) {
  return <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />
}

export default PostContent

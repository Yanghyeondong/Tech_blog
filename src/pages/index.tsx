import React, { FunctionComponent, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Introduction from 'components/Main/Introduction'
import PostList from 'components/Main/PostList'
import { graphql } from 'gatsby'
import { PostListItemType } from 'types/PostItem.types'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import Template from 'components/Common/Template'
import { Link } from 'gatsby'

const GoToPostButton = styled(Link)`
  margin: 70px auto;
  margin-bottom: 30px;
  font-size: 40px;
  padding: 10px 20px;
  font-weight: 800;
  height: auto;
  color: #ffffff;
  background-color: #433E49;
  border-radius: 10px;

  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transition: 0.5s;
    background-color: #ffffff;
    color: #433E49;
    border-radius: 10px;

  }

  @media (max-width: 768px) {
    font-size: 23px;
  }
`
const Title = styled.div`
  margin: auto;
  margin-top: 80px;
  margin-bottom: 10px;
  font-size: 45px;
  font-weight: 800;
  @media (max-width: 768px) {
    font-size: 30px;
    margin-top: 50px;
  }
`

type IndexPageProps = {
  location: {
    search: string
  }
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        siteUrl: string
      }
    }
    allMarkdownRemark: {
      edges: PostListItemType[]
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL: string
    }
  }
}

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges },
    file: {
      childImageSharp: { gatsbyImageData },
      publicURL,
    },
  },
}) {
  const [maxPostNum1, setMaxPostNum1] = useState(6);
  const [maxPostNum2, setMaxPostNum2] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setMaxPostNum1(2); // Adjust this value as per your requirement
        setMaxPostNum2(4);
      } else {
        setMaxPostNum1(6); // Adjust this value as per your requirement
        setMaxPostNum2(6);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <Introduction profileImage={gatsbyImageData} />
      <Title>🥃 새로운 한잔!</Title>
      <PostList selectedCategory={'all'} posts={edges} maxPostNum={maxPostNum1} />
      <Title>🍹 인기있는 한잔!</Title>
      <PostList selectedCategory={'Choice'} posts={edges} maxPostNum={maxPostNum2} />
      <GoToPostButton to="/post">🥂 최신 포스트 더보기</GoToPostButton>
    </Template>
  )
}

export default IndexPage

export const getShortPostList = graphql`
  query getShortPostList {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
      publicURL
    }
  }
`

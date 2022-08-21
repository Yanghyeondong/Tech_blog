import React, { FunctionComponent } from 'react'
import { graphql } from 'gatsby'
import { PostPageItemType } from 'types/PostItem.types'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'
import DisqusCommentBox from'components/Post/DisqusCommentBox'
import TableOfContents from "../components/Post/TableOfContents"
import styled from "@emotion/styled"

type PostTemplateProps = {
  data: {
    allMarkdownRemark: {
      edges: PostPageItemType[]
    }
  },
  location: {
    href: string
  }
}

const PostContainer = styled.div`
  margin: auto auto;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  @media (min-width: 1200px) {
    margin-left: calc( 50% - 384px );
  }
`

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
  location: { href },
}) {
  const {
    node: {
      html,
      id,
      tableOfContents,
      frontmatter: {
        title,
        summary,
        date,
        categories,
        thumbnail: {
          childImageSharp: { gatsbyImageData },
          publicURL,
        },
      },
    },
  } = edges[0];

  return (
    <Template title={title} description={summary} url={href} image={publicURL}>
        <PostHead
          title={title}
          date={date}
          categories={categories}
          thumbnail={gatsbyImageData}
        />
        <PostContainer>
          <PostContent html={html} />
          <TableOfContents content={tableOfContents} />
        </PostContainer>
        <DisqusCommentBox url={href} identifier={id} title={title}/>
    </Template>
  )
}

export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          id
          tableOfContents
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
          }
        }
      }
    }
  }
`
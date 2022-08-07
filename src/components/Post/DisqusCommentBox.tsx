import React, { FunctionComponent } from 'react'
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
import styled from '@emotion/styled'

type DisqusCommentBoxProps = {
    url: string
    identifier: string
    title: string
}

const Wrapper = styled.div`
    width: 768px;
    margin: auto auto;
    padding: 0 10px;
    @media (max-width: 768px) {
        width: 100%;
        padding: 0 20px;
    }
`

const DisqusCommentBox: FunctionComponent<DisqusCommentBoxProps> = function({
    url,
    identifier,
    title
}) {
    
const config = {
    url: url,
    identifier: identifier,
    title: title,

}
console.log(url)
console.log(identifier)
console.log(title)

    return(
        <Wrapper>
            <Disqus config={config} />
        </Wrapper>
    )

}

export default DisqusCommentBox
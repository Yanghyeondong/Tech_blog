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
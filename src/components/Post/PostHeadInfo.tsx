import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

export type PostHeadInfoProps = {
  title: string
  date: string
  categories: string[]
}

const PostHeadInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 768px;
  height: 400px;
  margin: 0 auto;
  padding: 60px 0;
  color: #ffffff;

  @media (max-width: 768px) {
    height: 330px;
    width: 100%;
    padding: 40px 20px;
  }
`

const PrevPageIcon = styled.div`
  margin-left: 95%;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }
`

const Title = styled.div`
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: break-word;
  margin: auto 0;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 42px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`

const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 15px;
    font-weight: 400;
  }
`
const Categories = styled.div`
  display: flex;
  justify-content: start;
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`
const CategoryItem = styled.div`
  margin: 2px 5px;
  padding: 1px 7px 4px 7px;
  border-radius: 6px;
  background-color: #49ae8e;
  font-size: 16px;
  font-weight: 800;
  color: white;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const DateWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    margin: 7px 7px;
  }
`
const DateIcon = styled.div`
  margin-right: 10px;
`

const PostHeadInfo: FunctionComponent<PostHeadInfoProps> = function ({
  title,
  date,
  categories,
}) {
  const goBackPage = () => window.history.back()

  return (
    <PostHeadInfoWrapper>
      <Title>{title}</Title>
      <PostData>
        <Categories>
          {categories.map(category => (
            <CategoryItem key={category}>{category}</CategoryItem>
          ))}
        </Categories>
        <DateWrapper>
          <DateIcon>
            <FontAwesomeIcon icon={faCalendarDays}/> 
          </DateIcon>
            {date}
        </DateWrapper>
      </PostData>
    </PostHeadInfoWrapper>
  )
}

export default PostHeadInfo

import { MutableRefObject, useState, useEffect, useRef, useMemo } from 'react'
import { PostListItemType } from 'types/PostItem.types'

export type useInfiniteScrollType = {
  containerRef: MutableRefObject<HTMLDivElement | null>
  postList: PostListItemType[]
}

const NUMBER_OF_ITEMS_PER_PAGE = 10

const useInfiniteScroll = function (
  selectedCategory: string,
  posts: PostListItemType[],
  maxPostNum: number,
): useInfiniteScrollType {

  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null)
  const observer: MutableRefObject<IntersectionObserver | null> =
    useRef<IntersectionObserver>(null)
  const [count, setCount] = useState<number>(1)

  if (maxPostNum !== 0){
    let filteredPosts = posts;

    if (selectedCategory != 'all') {
      filteredPosts = posts.filter((item: { node: { frontmatter: { categories: string[] } } }) =>
        !item.node.frontmatter.categories || item.node.frontmatter.categories.includes(selectedCategory)
      );
    }
    return {
      containerRef,
      postList: filteredPosts.slice(0, maxPostNum)
    }
  }

  const postListByCategory = useMemo<PostListItemType[]>(
    () =>
      posts.filter(({ node: { frontmatter: { categories } } }: PostListItemType) =>
        ( selectedCategory === 'All' ) ? true : categories.includes(selectedCategory)
      ),
    [selectedCategory],
  )

  useEffect(() => {
    observer.current = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return

      setCount(value => value + 1)
      observer.unobserve(entries[0].target)
    })
  }, [])

  useEffect(() => setCount(1), [selectedCategory])

  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0 ||
      observer.current === null
    )
      return

    observer.current.observe(
      containerRef.current.children[containerRef.current.children.length - 1],
    )
  }, [count, selectedCategory])

  return {
    containerRef,
    postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  }
}

export default useInfiniteScroll
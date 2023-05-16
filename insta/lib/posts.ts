// 投稿一覧取得
export const getPostList = async () => {
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post_list/`, {
    method: 'GET',
  })
  const posts = await apiRes.json()
  return posts
}

// 投稿一覧ID取得
export const getPostIds = async () => {
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post_list/`, {
    method: 'GET',
  })
  const posts = await apiRes.json()

  return posts.map((post) => {
    return {
      params: {
        id: String(post.id)
      }
    }
  })
}

// 投稿詳細取得
export const getPostDetail = async (id: number) => {
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post_detail/${id}`, {
    method: 'GET',
  })
  const post = await apiRes.json()
  return post
}

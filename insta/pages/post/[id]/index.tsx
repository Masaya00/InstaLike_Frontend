import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { delete_post, reset_post_status } from '../../../actions/post' // 追加
import { getPostIds, getPostDetail } from '../../../lib/posts'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon } from '@heroicons/react/outline'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const DetailPost = ({ staticPost, id }: any) => {
  const dispatch: any = useDispatch()
  const router = useRouter()
  const user = useSelector((state: any) => state.auth.user)
  const delete_post_success = useSelector((state: any) => state.post.delete_post_success)

  const { data: post, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/post_detail/${id}/`,
    fetcher,
    {
      fallbackData: staticPost,
    }
  )

  useEffect(() => {
    mutate()
  }, [])

  // 状態解除
  useEffect(() => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(reset_post_status())
    }
  }, [dispatch])

  if (router.isFallback || !post) {
    return <div className="text-center">Loading...</div>
  }

  // 削除
  const deletePost = async () => {
    if (dispatch && dispatch !== null && dispatch !== undefined && post) {
      await dispatch(delete_post(post.id))
    }
  }

  if (delete_post_success) {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>InstaLike | 詳細</title>
      </Head>

      {post && (
        <div className='max-w-screen-lg mx-auto px-4'>
            {user && user.id === post.user.id && (
              <div className="text-sm flex space-x-4">
                <div>
                  <Link href={`/post/${post.id}/edit`} >
                    <div className='border px-5 py-2 mt-5 mb-4 text-white bg-green-700 rounded'>編集</div>
                  </Link>
                </div>
                <div className="cursor-pointer" onClick={deletePost}>
                  <div className='border px-5 py-2 mt-5 mb-4 text-white bg-red-600 rounded'>削除</div>
                </div>
              </div>
            )}
          <div className=" bg-white border">
            <div className='text-2xl p-5 border-l-4 border-blue-300 ml-5 my-5 border-solid'>{post.title}</div>
            <div className='p-4'>{post.content}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default DetailPost

export async function getStaticPaths() {
  const paths = await getPostIds()
  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }: any) {
  const staticPost = await getPostDetail(params.id)

  return {
    props: {
      id: staticPost.id,
      staticPost,
    },
    revalidate: 1,
  }
}
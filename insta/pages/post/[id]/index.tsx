import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { delete_post, reset_post_status } from '../../../actions/post' // 追加
import { getPostIds, getPostDetail } from '../../../lib/posts'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

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
        <title>詳細</title>
      </Head>

      {post && (
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="grid grid-cols-3 bg-white border">
            <div className="col-span-2">
              <Image
                src={post.image}
                className=""
                alt={post.title}
                width={1000}
                height={1000}
                objectFit="cover"
              />
            </div>
            <div className="col-span-1">
              <div className="border-b p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Image
                    src={post.user.image}
                    className="rounded-full"
                    alt={post.title}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div>{post.user.name}</div>
                    <div>{post.title}</div>
                  </div>
                </div>
                {user && user.id === post.user.id && (
                  <div className="text-sm flex space-x-4">
                    <div>
                      <Link href={`/post/${post.id}/edit`}>
                        編集
                      </Link>
                    </div>
                    <div className="cursor-pointer" onClick={deletePost}>
                      削除
                    </div>
                  </div>
                )}
              </div>
              <div className="whitespace-pre p-4">
                <div className="leading-relaxed break-words whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>
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
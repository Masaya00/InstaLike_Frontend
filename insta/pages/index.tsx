import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { getPostList } from '../lib/posts'
import { reset_auth_status } from '../actions/auth'
import { reset_post_status } from '../actions/post' // 追加
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon } from '@heroicons/react/outline'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Index = ({ staticPosts }: any) => {
  const dispatch: any = useDispatch()
  const router = useRouter()
  const user = useSelector((state: any) => state.auth.user)
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)

  if (!isAuthenticated && typeof window !== 'undefined') {
    router.replace('/login');
  }

  const { data: posts, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/post_list/`,
    fetcher,
    {
      fallbackData: staticPosts,
    }
  )

  useEffect(() => {
    mutate()
  }, [])

  // 状態解除
  useEffect(() => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      dispatch(reset_auth_status())
      dispatch(reset_post_status())
    }
  }, [dispatch])

  if (router.isFallback || !posts) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>InstaLike</title>
      </Head>
      <div className="max-w-screen-lg mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            {posts &&
              posts.map((data: any) => (
                <div className="border mb-6 bg-white" key={data.id}>
                  <Link href={`/post/${data.id}`}>
                    <div className="flex items-center space-x-4 p-4 border-b">
                      <div className='text-2xl'>{data.title}</div>
                      <div >{data.user.name}</div>
                    </div>
                    <div className="m-4 mb-10">
                      <div className="truncate">{data.content}</div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
          <div className="col-span-1">
            {user && (
              <div className="flex items-center space-x-4">
                <UserIcon className="h-10 w-10 border rounded-full border-gray-300 p-1" />
                <div className='text-xl'>{user.name}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const staticPosts = await getPostList()

  return {
    props: { staticPosts },
    revalidate: 1,
  }
}

export default Index
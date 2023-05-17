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
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {posts &&
              posts.map((data: any) => (
                <div className="border mb-6 bg-white" key={data.id}>
                  <div className="flex items-center space-x-4 p-4">
                    <Image
                      src={data.user.image}
                      className="rounded-full"
                      alt={data.user.name}
                      width={40}
                      height={40}
                    />
                    <div>
                      <div>{data.user.name}</div>
                      <div>{data.title}</div>
                    </div>
                  </div>
                  <div className='border-b p-5'>
                    <Link href={`/post/${data.id}`}>
                      <Image
                        src={data.image}
                        className=""
                        alt={data.title}
                        width={5000}
                        height={4000}
                      />
                    </Link>
                  </div>
                  <div className="m-4">
                    <div className='text-gray-400'>コメント</div>
                    <div className="truncate">{data.content}</div>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-span-1">
            {user && (
              <div className="flex items-center space-x-4">
                <Image
                  src={user.image}
                  className="rounded-full"
                  alt={user.name}
                  width={50}
                  height={50}
                />
                <div>{user.name}</div>
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
import cookie from 'cookie'

const refresh_api =  async (req: any, res: any) => {
  if (req.method === 'GET') {
    const cookies: any = cookie.parse(req.headers.cookie ?? '')
    const refresh: any = cookies.refresh ?? false

    if (refresh === false) {
      return res.status(401).json({
        error: 'リフレッシュトークンがありません'
      })
    }

    const body = JSON.stringify({
      refresh,
    })

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })

      const data = await apiRes.json()

      if (apiRes.status === 200) {
        cookie.serialize('access', data.access, {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60
        })
      } else {
        return res.status(apiRes.status).json({
          error: 'リフレッシュトークン取得に失敗しました',
        })
      }

    } catch {
      return res.status(500).json({
        error: 'リフレッシュトークン取得に失敗しました',
      })
    }

  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({error: `Method ${req.method} not allowed`})
  }
}

export default refresh_api;

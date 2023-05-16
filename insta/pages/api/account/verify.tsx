import cookie from 'cookie'

const verify_api = async (req: any, res: any) => {
  if (req.method === 'GET') {
    const cookies: any = cookie.parse(req.headers.cookie ?? '')
    const access: any = cookies.access ?? false

    if (access === false) {
      return res.status(403).json({
        error: 'アクセストークンがありません。'
      })
    }

    const body = JSON.stringify({
      token: access
    })

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })

    } catch (err) {
      return res.status(500).json({
        error: '認証に失敗しました',
      })
    }

  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({error: `Method ${req.method} not allowed`})
  }
}

export default verify_api;

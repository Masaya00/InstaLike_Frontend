// NextJSのログイン用のAPIを作成する
import cookie from 'cookie';

const login_api = async(req: any, res: any) => {
  console.log('ああああ')
  if (req.method === 'POST') {
    console.log(req);
    const {email, password} = req.body

    // JavaScriptのオブジェクトをJSON形式の文字列に変換するためのメソッド
    const body = JSON.stringify({
      email,
      password
    })

    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      })

      const data = await apiRes.json()

      if (apiRes.status === 200 ) {
        res.setHeader('Set-Cookie', [
          // cookie関連のこと色々やらなければ。アクセストークン
          cookie.serialize('access', data.access,{
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 // １時間
          }),
          // リフレッシュトークン
          cookie.serialize('refresh', data.refresh, {
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 3, // 3日
          })
        ])

        return res.status(200).json({
          success: 'ログインに成功しました',
        })
      } else {
        return res.status(apiRes.status).json({
          error: 'ログインに失敗しました。'
        })
      }

    } catch (err) {
      return res.status(500).json({
        error: 'ログインに失敗しました',
      })
    }

  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({error: `Method ${req.method} not allowed`})
  }
}

export default login_api
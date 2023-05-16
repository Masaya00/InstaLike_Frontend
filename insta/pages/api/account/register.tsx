const register_api = async(req: any, res: any) => {
  if (req.method === 'POST') {
    const {name, email, password} = req.body

    const body = JSON.stringify({
      name,
      email,
      password,
    })

    // 新規ユーザー登録のためにapiをpostで叩いている
    // NEXT_PUBLIC_API_URLは http://127.0.0.1:8000 を定義
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`) => http://127.0.0.1:8000/api/auth/register/ が出力されることを確認
    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body
      })

      const data = await apiRes.json()

      if (apiRes.status === 201) {
        return res.status(200).json({
          success: 'アカウント登録に成功しました',
        })
      } else {
        return res.status(apiRes.status).json({
          error: 'アカウント登録に失敗しました。',
        })
      }

    } catch (err) {
      // 以下console.log(err)で対象のエラーが発生
      console.log(err)
      return res.status(500).json({
        error: 'アカウント登録に失敗しました',
      })
    }

  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({error: `Method ${req.method} not allowed`})
  }
}

export default register_api
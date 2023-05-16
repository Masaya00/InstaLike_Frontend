import cookie from 'cookie'


const logout_api = async (req: any, res: any) => {
  console.log('logout_api通過')
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', [
      cookie.serialize('access', '', {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      }),
      cookie.serialize('refresh', '', {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      }),
    ])
    console.log('ログアウト成功')
    return res.status(200).json({
      success: 'ログアウトに成功しました',
    })
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({
      error: `Method ${req.method} now allowed`,
    })
  }
}

export default logout_api;
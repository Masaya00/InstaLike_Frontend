import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { login } from '../actions/auth';
import  Loader  from "react-loader-spinner";
import Head from "next/head";

const Login = () => {
  // Reduxで使うストアオブジェクトの状態を変更するためのアクション
  const dispatch = useDispatch();
  const router = useRouter()
  // useSelectorはストア内の状態をコンポーネントから取得するために使用されるフック
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const loading = useSelector((state: any) => state.auth.loading)

  // 入力された値の格納場所
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // formDataの値をemailとpasswordに入れている
  const {email, password} = formData

  const onChange = (e: any) => {
    // ...はスプレッド構文でformDataの中身を展開しつつ、name:valueの形でFormDataを更新している
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = async (e: any) => {
    // デフォルトの動作をキャンセルするメソッド submitしてしまうのを防いでいる
    e.preventDefault()
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      await dispatch(login(email, password))
    }
  }
  // 要はログインしていたら/に遷移させるということ
  if (typeof window !== 'undefined' && isAuthenticated) {
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>有料会員サイト | ログイン</title>
      </Head>
      <div className="text-center text-2xl mb-5">
        ログイン
      </div>
      <form className="w-1/3 mx-auto" onSubmit={onSubmit}>
        <div className="mb-4">
          <div className="mb-1">
            メールアドレス
          </div>
          <input type="email" name='email' className="input-form" placeholder="xxx@xxx.com" onChange={onChange} value={email} required />
        </div>
      </form>
      <form className="w-1/3 mx-auto" onSubmit={onSubmit}>
        <div className="mb-4">
          <div className="mb-1">
            パスワード
          </div>
          <input type="password" name='password' className="input-form" placeholder="半角英数８文字以上" onChange={onChange} value={password} required />
        </div>
        <div className="flex justify-center">
          <button className="button-yellow" type="submit">
            送信
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;


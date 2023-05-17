import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { register } from '../actions/auth'
import Loader from "react-loader-spinner";
import Head from "next/head";


const Register = () => {
  const dispatch: any = useDispatch()
  const router = useRouter()
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const loading = useSelector((state: any) => state.auth.loading)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const {name, email, password} = formData

  const onSubmit = async (e: any) => {
    e.preventDefault()

    // actions/authで定義した
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      await dispatch(register(name, email, password))
    }
  }

  const onChange = (e: any) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  if (typeof window !== 'undefined' && isAuthenticated) {
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title> InstaLike | アカウント登録</title>
      </Head>
      <div className="text-center text-2x1 mb-5">アカウント登録</div>

      <form className="w-1/3 mx-auto" onSubmit={onSubmit}>
        <div className="mb-4">
          <div className="mb-1">
            名前
          </div>
          <input type="text" className="input-form" name='name' placeholder="ベイス太郎" onChange={onChange} value={name} required />
        </div>

        <div className="mb-4">
          <div className="mb-1">
            メールアドレス
          </div>
          <input type="email" className="input-form" name='email' placeholder="xxxxxx@xxx.com" onChange={onChange} value={email} required />
        </div>

        <div className="mb-4">
          <div className="mb-1">
            パスワード
          </div>
          <input type="password" className="input-form" name='password' placeholder="半角英数8字以上" onChange={onChange} value={password} required />
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

export default Register;
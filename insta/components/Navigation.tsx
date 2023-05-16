import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../actions/auth'
import {
  HomeIcon,
  LogoutIcon,
  LoginIcon,
  PlusCircleIcon,
  UserAddIcon,
  UserIcon,
} from '@heroicons/react/outline'

const Navigation = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const logoutHandler = async () => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      await dispatch(logout())
    }
  }

  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="border-b py-3">
        <div className="max-w-5xl mx-auto flex justify-between px-4">
          <div className="text-lg font-extrabold">
            <Link href="/">
              InstaLike
            </Link>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <div className="flex space-x-4">
                <Link href="/post/new">
                    <PlusCircleIcon className="h-7 w-7" />
                </Link>
                <Link href="/profile">
                    <UserIcon className="h-7 w-7" />
                </Link>
                <div onClick={logoutHandler} className="cursor-pointer">
                  <LogoutIcon className="h-7 w-7" />
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                    <LoginIcon className="h-7 w-7" />
                </Link>
                <Link href="/register">
                    <UserAddIcon className="h-7 w-7" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation
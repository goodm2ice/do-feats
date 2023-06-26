import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { getUser } from '../utils/functions'
import { UserWithToken } from '../api'

export const UserContext = createContext<[UserWithToken, (user: UserWithToken, remember: boolean) => void, () => void]>(null)
export const useUser = () => useContext(UserContext)

export const UserOutlet = () => {
    const [user, setUser] = useState<UserWithToken>()

    const navigate = useNavigate()

    useEffect(() => setUser(getUser()), [])

    const onLogin = useCallback((user: UserWithToken, remember: boolean) => {
        const storage = remember ? localStorage : sessionStorage
        storage.setItem('user', JSON.stringify(user))
        setUser(user)
        navigate(0)
    }, [])

    const onLogout = useCallback(() =>  {
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        setUser(null)
        navigate(0)
    }, [])

    return (
        <UserContext.Provider value={[user, onLogin, onLogout]}>
            <Outlet />
        </UserContext.Provider>
    )
}

export default UserOutlet

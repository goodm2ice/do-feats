import { Layout } from 'antd'
import { TabBar } from 'antd-mobile'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BookOutlined, FormOutlined, UserOutlined } from '@ant-design/icons'

import { useUser } from './UserOutlet'
import { ReactNode, useEffect, useMemo } from 'react'

const makeTab = (key: string, title: ReactNode, icon: ReactNode) => ({ key, title, icon })

const updateVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export const LayoutOutlet = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [user] = useUser()

    const tabs = useMemo(() => [
        makeTab('/training', 'Упражнения', <FormOutlined />),
        user && makeTab('/dictionary', 'Словарь', <BookOutlined />),
        makeTab('/user', 'Профиль', <UserOutlined />),
    ].filter(Boolean), [user])

    useEffect(() => {
        window.addEventListener('resize', updateVh)
        updateVh()

        return () => {
            window.removeEventListener('resize', updateVh)
        }
    }, [])

    const activeKey = useMemo(() => {
        const secondSlash = location.pathname.indexOf('/', 1)
        if (secondSlash < 0) return location.pathname
        return location.pathname.slice(0, secondSlash)
    }, [location.pathname])
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Outlet />
            </div>
            <TabBar activeKey={activeKey} onChange={(key) => navigate(key)}>
                {tabs.map((item) => (
                    <TabBar.Item {...item} />
                ))}
            </TabBar>
        </div>
    )
}

export default LayoutOutlet

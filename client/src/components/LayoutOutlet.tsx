import { Layout } from 'antd'
import { TabBar } from 'antd-mobile'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BookOutlined, FormOutlined, UserOutlined } from '@ant-design/icons'

import { useUser } from './UserOutlet'
import { ReactNode, useMemo } from 'react'

const makeTab = (key: string, title: ReactNode, icon: ReactNode) => ({ key, title, icon })

export const LayoutOutlet = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [user] = useUser()

    const tabs = useMemo(() => [
        makeTab('/training', 'Упражнения', <FormOutlined />),
        user && makeTab('/dictionary', 'Словарь', <BookOutlined />),
        makeTab('/user', 'Профиль', <UserOutlined />),
    ].filter(Boolean), [user])
    
    return (
        <Layout style={{ height: '100%' }}>
            <Layout.Content>
                <Outlet />
            </Layout.Content>
            <Layout.Footer>
                <TabBar activeKey={location.pathname} onChange={(key) => navigate(key)}>
                    {tabs.map((item) => (
                        <TabBar.Item {...item} />
                    ))}
                </TabBar>
            </Layout.Footer>
        </Layout>
    )
}

export default LayoutOutlet

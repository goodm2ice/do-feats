import { Avatar, Button, Form, Grid, Input, List, Picker, Space, Switch } from 'antd-mobile'
import { useCallback, useEffect, useState } from 'react'

import { useUser } from '../components/UserOutlet'
import { asyncCall } from '../utils/functions'
import { Body_login, LanguagesService, LoginService, UserCreate } from '../api'

const requiredRules = [{ required: true, message: 'Это обязательное поле!' }]

export const User = () => {
    const [loginForm] = Form.useForm()

    const [user, onLogin, onLogout] = useUser()
    const [isReg, setShowRegister] = useState(false)
    const [languages, setLanguages] = useState([])

    useEffect(() => {
        asyncCall(async () => {
            const langs = await LanguagesService.getAll()
            setLanguages([langs.map((lang) => ({ label: lang.title, value: lang.id }))])
        })
    }, [])

    const onFinish = useCallback((values: any) => {
        asyncCall(async () => {
            let user
            if (isReg) {
                if (values.native_language_id) values.native_language_id = values.native_language_id[0]
                user = await LoginService.register(values as UserCreate)
            } else {
                user = await LoginService.login(values as Body_login)
            }
            onLogin(user, values.remember_me)
        })
    }, [isReg, onLogin])

    return (
        <>
            {user ? (
                <>
                    <List>
                        <List.Item
                            prefix={<Avatar src={''} />}
                            description={'Поддержка загрузки аватаров будет добавлена позже'}
                        >
                            {user.username}
                        </List.Item>
                    </List>
                    <Space direction={'vertical'} block style={{ margin: 10 }}>
                        <Grid.Item>
                            <Picker columns={languages} value={[user.native_language?.id]} confirmText={'Изменить'}>
                                {(_, actions) => (
                                    <Button block onClick={actions.open}>Изменить родной язык ({user.native_language?.title || 'Не указано'})</Button>
                                )}
                            </Picker>
                        </Grid.Item>
                        <Grid.Item>
                            <Button block color={'warning'} onClick={onLogout}>Выйти из аккаунта</Button>
                        </Grid.Item>
                    </Space>
                </>
            ) : (
                <Form
                    form={loginForm}
                    layout={'horizontal'}
                    onFinish={onFinish}
                    footer={(
                        <Space direction={'vertical'} block>
                            <Button block type={'submit'} color={'primary'} size={'large'}>
                                {isReg ? 'Зарегистрироваться' : 'Войти'}
                            </Button>
                            <Button block color={'default'} fill={'outline'} onClick={() => setShowRegister((p) => !p)}>
                                {isReg ? 'Есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                            </Button>
                        </Space>
                    )}
                >
                    <Form.Header>
                        {isReg ? 'Регистрация в системе' : 'Вход в систему'}
                    </Form.Header>
                    <Form.Item name={'username'} label={'Имя пользователя'} rules={requiredRules}>
                        <Input placeholder={'vasya_1993'} />
                    </Form.Item>
                    <Form.Item name={'password'} label={'Пароль'} rules={requiredRules}>
                        <Input type={'password'} placeholder={'qwerty_123'} />
                    </Form.Item>
                    <Form.Item hidden={!isReg} name={'native_language_id'} label={'Родной язык'} rules={isReg && requiredRules} trigger={'onConfirm'}>
                        <Picker columns={languages}>
                            {(items, actions) => (
                                <Button onClick={actions.open}>{items[0]?.label || 'Не указано'}</Button>
                            )}
                        </Picker>
                    </Form.Item>
                    <Form.Item name={'remember_me'} label={'Запомнить меня'}>
                        <Switch />
                    </Form.Item>
                </Form>
            )}
        </>
    )
}

export default User

import { Toast } from 'antd-mobile'

import { UserWithToken } from '../api'

export const asyncCall = (
    callback: () => Promise<void>,
) => {
    const f = async () => {
        const handler = Toast.show({
            icon: 'loading',
            content: 'Загрузка...'
        })
        try {
            await callback()
        } catch (e) {
            const errorText = e.message
            console.error(errorText)
            handler.close()
            const errorHandler = Toast.show({
                icon: 'fail',
                content: errorText,
                duration: 1,
            })
            setTimeout(errorHandler.close, 2500)
        } finally {
            handler.close()
        }
    }

    f()
}

export const getUser = (): UserWithToken => {
    try {
        return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'))
    } catch (e) {
        return null
    }
}

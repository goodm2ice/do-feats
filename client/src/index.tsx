import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd-mobile'

import { getUser } from './utils/functions'
import { OpenAPI } from './api'
import ruRU from './ruRU'

import App from './App'

import './styles/index.less'

const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)

OpenAPI.TOKEN = async () => getUser()?.access_token || ''

const el = document.getElementById('app')

ReactDOM.render((
    <ConfigProvider locale={ruRU}>
        <App />
    </ConfigProvider>
), el)

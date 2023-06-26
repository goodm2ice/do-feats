import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import SuspenseFallback from './components/SuspenseFallback'

const UserOutlet = lazy(() => import('./components/UserOutlet'))
const LayoutOutlet = lazy(() => import('./components/LayoutOutlet'))

const Dictionary = lazy(() => import('./pages/Dictionary'))
const Training = lazy(() => import('./pages/Training'))
const User = lazy(() => import('./pages/User'))

export const App = () => (
    <Suspense fallback={<SuspenseFallback />}>
        <Router>
            <Routes>
                <Route element={<UserOutlet />}>
                    <Route element={<LayoutOutlet />}>
                        <Route path={'training'} element={<Training />} />
                        <Route path={'dictionary'} element={<Dictionary />} />
                        <Route path={'user'} element={<User />} />
                    </Route>
                </Route>
                <Route path={'*'} element={<Navigate to={'/training'} replace />} />
            </Routes>
        </Router>
    </Suspense>
)

export default App

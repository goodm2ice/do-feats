import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import SuspenseFallback from './components/SuspenseFallback'

const Home = lazy(() => import('./pages/Home'))

export const App = () => (
    <Suspense fallback={<SuspenseFallback />}>
        <Router>
            <Routes>
                <Route path={'/home'} element={<Home />} />
                <Route path={'*'} element={<Navigate to={'/home'} replace />} />
            </Routes>
        </Router>
    </Suspense>
)

export default App

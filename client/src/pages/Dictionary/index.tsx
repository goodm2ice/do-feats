import { useCallback, useEffect, useState } from 'react'
import { Tabs } from 'antd-mobile'

import Languages from './Languages'
import Topics from './Topics'
import Words from './Words'

const useHash = () => {
    const [hash, setHash] = useState(() => window.location.hash)
  
    const hashChangeHandler = useCallback(() => setHash(window.location.hash), [])
  
    useEffect(() => {
        window.addEventListener('hashchange', hashChangeHandler)
        return () => {
            window.removeEventListener('hashchange', hashChangeHandler)
        }
    }, [])
  
    const updateHash = useCallback((newHash: string) => {
        if (newHash !== hash) window.location.hash = newHash
    }, [hash])
  
    return [hash, updateHash] as const
}

export const Dictionary = () => {
    const [hash, setHash] = useHash()

    return (
        <Tabs activeKey={hash ? hash.slice(1) : 'languages'} onChange={(key) => setHash(key)}>
            <Tabs.Tab title={'Языки'} key={'languages'}>
                <Languages />
            </Tabs.Tab>
            <Tabs.Tab title={'Тема'} key={'topics'}>
                <Topics />
            </Tabs.Tab>
            <Tabs.Tab title={'Слова'} key={'words'}>
                <Words />
            </Tabs.Tab>
        </Tabs>
    )
}

export default Dictionary

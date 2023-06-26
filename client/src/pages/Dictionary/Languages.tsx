import { Button, Dialog, ErrorBlock, Form, Input, List, NavBar, Space, SwipeAction } from 'antd-mobile'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { asyncCall } from '../../utils/functions'
import { Language, LanguagesService } from '../../api'

const makeOnDelete = (title: string, onFinish: () => void) => () => Dialog.show({
    closeOnMaskClick: true,
    closeOnAction: true,
    content: `Вы уверены, что хотите удалить язык "${title}"?`,
    actions: [
        { key: 'cancel', text: 'Отмена' },
        { key: 'delete', text: 'Удалить', bold: true, danger: true },
    ],
    onAction: (action) => action.key === 'delete' && onFinish(),
})

export const Languages = () => {
    const [form] = Form.useForm()

    const [languages, setLanguages] = useState<Language[]>([])
    const [selectedLanguageIdx, setSelectedLanguageIdx] = useState<number>(null)

    const selectedLanguage = useMemo(() => {
        if (selectedLanguageIdx < 0 || selectedLanguageIdx >= languages.length) return null

        return languages[selectedLanguageIdx]
    }, [languages, selectedLanguageIdx])

    const update = useCallback(() => asyncCall(async () => {
        const langs = await LanguagesService.getAll()
        setLanguages(langs)
    }), [])

    const changeSelectedLanguage = useCallback((idx: number | null) => {
        if (idx !== null && idx >= 0 && idx < languages.length)
            form.setFieldsValue(languages[idx])
        else
            form.resetFields()
        setSelectedLanguageIdx(idx)
    }, [form, languages])
    
    const deleteLanguage = useCallback((id: number) => asyncCall(async () => {
        await LanguagesService.delete(id)
        changeSelectedLanguage(null)
        update()
    }), [update, changeSelectedLanguage])
    
    const onFinish = useCallback((language: any) => asyncCall(async () => {
        if (typeof language.id === 'number')
            await LanguagesService.update(language.id, language)
        else
            await LanguagesService.insert(language)
        changeSelectedLanguage(null)
        update()
    }), [update, changeSelectedLanguage])

    useEffect(update, [update])

    return selectedLanguageIdx !== null ? (
        <>
            <NavBar onBack={() => changeSelectedLanguage(null)} back={'Отмена'}>
                {selectedLanguage?.title || 'Добавить'}
            </NavBar>
            <Form
                form={form}
                onFinish={onFinish}
                footer={(
                    <Space direction={'vertical'} block>
                        <Button block color={'primary'} type={'submit'}>Сохранить</Button>
                        {selectedLanguage && (
                            <Button block color={'danger'} onClick={makeOnDelete(selectedLanguage.title, () => deleteLanguage(selectedLanguage.id))}>
                                Удалить
                            </Button>
                        )}
                    </Space>
                )}
            >
            <Form.Item hidden name={'id'}><Input /></Form.Item>
                <Form.Item name={'title'} label={'Название языка'} rules={[{ required: true, message: 'Это обязательное поле!' }]}>
                    <Input placeholder={'中文'} />
                </Form.Item>
            </Form>
        </>
    ) : (
        <Space direction={'vertical'} block>
            <Button block onClick={() => changeSelectedLanguage(-1)}>Добавить язык</Button>
            {languages?.length > 0 ? (
                <List>
                    {languages.map((lang, i) => (
                        <SwipeAction
                            key={lang.id}
                            leftActions={[{
                                key: 'delete',
                                text: 'Удалить',
                                color: 'danger',
                                onClick: makeOnDelete(lang.title, () => deleteLanguage(lang.id)),
                            }]}
                        >
                            <List.Item onClick={() => changeSelectedLanguage(i)}>{lang.title}</List.Item>
                        </SwipeAction>
                    ))}
                </List>
            ) : (
                <ErrorBlock status={'empty'} title={'Пусто!'} description={'Ни один язык ещё не добавлен!'} />
            )}
        </Space>
    )
}

export default Languages

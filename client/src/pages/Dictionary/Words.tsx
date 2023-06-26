import { Button, Dialog, ErrorBlock, Form, Input, List, NavBar, Picker, Space, SwipeAction } from 'antd-mobile'
import { PickerColumn } from 'antd-mobile/es/components/picker-view'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { asyncCall } from '../../utils/functions'
import { LanguagesService, TopicsService, Word, WordsService } from '../../api'

const requiredRules = [{ required: true, message: 'Это обязательное поле!' }]

const makeOnDelete = (title: string, onDelete: () => void) => () => Dialog.show({
    closeOnMaskClick: true,
    closeOnAction: true,
    content: `Вы уверены, что хотите удалить язык "${title}"?`,
    actions: [
        { key: 'cancel', text: 'Отмена' },
        { key: 'delete', text: 'Удалить', bold: true, danger: true },
    ],
    onAction: (action) => action.key === 'delete' && onDelete(),
})

export const Words = () => {
    const [form] = Form.useForm()

    const [words, setWords] = useState<Word[]>([])
    const [languages, setLanguages] = useState<PickerColumn[]>([])
    const [topics, setTopics] = useState<PickerColumn[]>([])

    const [selectedWordIdx, setSelectedWordIdx] = useState<number>(null)

    const selectedWord = useMemo(() => {
        if (selectedWordIdx < 0 || selectedWordIdx >= words.length) return null
    
        return words[selectedWordIdx]
    }, [words, selectedWordIdx])

    const update = useCallback(() => asyncCall(async () => {
        const words = await WordsService.getAll()
        setWords(words)
    }), [])

    const changeSelectedWord = useCallback((idx: number | null) => {
        if (idx !== null && idx >= 0 && idx < words.length) {
            const word = { ...words[idx] } as any
            word.language_id = [word.language.id]
            word.topic_id = [word.topic.id]
            form.setFieldsValue(word)
        } else
            form.resetFields()
        setSelectedWordIdx(idx)
    }, [form, words])

    const onFinish = useCallback((values: any) => asyncCall(async () => {
        if (values.language_id) values.language_id = values.language_id[0]
        if (values.topic_id) values.topic_id = values.topic_id[0]
        if (typeof values.id === 'number')
            await WordsService.update(values.id, values)
        else
            await WordsService.insert(values)
        changeSelectedWord(null)
        update()
    }), [update, changeSelectedWord])

    const deleteWord = useCallback((wordId: number) => asyncCall(async () => {
        await WordsService.delete(wordId)
        update()
    }), [update])

    useEffect(update, [update])

    useEffect(() => asyncCall(async () => {
        const languages = await LanguagesService.getAll()
        setLanguages([languages.map((lang) => ({ value: lang.id, label: lang.title }))])
    }), [])

    useEffect(() => asyncCall(async () => {
        const topics = await TopicsService.getAll()
        setTopics([[
            { value: null, label: 'Без темы' },
            ...topics.map((topic) => ({ value: topic.id, label: topic.title })),
        ]])
    }), [])

    return (
        <div className={'df-page'}>
            {selectedWordIdx !== null ? (
                <>
                    <NavBar onBack={() => changeSelectedWord(null)} back={'Отмена'}>
                        {selectedWord?.title || 'Добавить'}
                    </NavBar>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        footer={(
                            <Space direction={'vertical'} block>
                                <Button block color={'primary'} type={'submit'}>Сохранить</Button>
                                {selectedWord && (
                                    <Button block color={'danger'} onClick={makeOnDelete(selectedWord.title, () => deleteWord(selectedWord.id))}>
                                        Удалить
                                    </Button>
                                )}
                            </Space>
                        )}
                    >
                        <Form.Item hidden name={'id'}><Input /></Form.Item>
                        <Form.Item name={'title'} label={'Слово'} rules={requiredRules}>
                            <Input placeholder={'单词'} />
                        </Form.Item>
                        <Form.Item name={'pronunciation'} label={'Произношение'} rules={requiredRules}>
                            <Input placeholder={'dāncí'} />
                        </Form.Item>
                        <Form.Item name={'language_id'} label={'Язык слова'} rules={requiredRules} trigger={'onConfirm'}>
                            <Picker columns={languages}>
                                {(items, actions) => (
                                    <Button size={'small'} onClick={actions.open}>{items[0]?.label || 'Не указан'}</Button>
                                )}
                            </Picker>
                        </Form.Item>
                        <Form.Item name={'topic_id'} label={'Тема'} trigger={'onConfirm'}>
                            <Picker columns={topics}>
                                {(items, actions) => (
                                    <Button size={'small'} onClick={actions.open}>{items[0]?.label || 'Не указана'}</Button>
                                )}
                            </Picker>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <>
                    <div className={'df-scrollable'} style={{ flex: 1 }}>
                        {words?.length > 0 ? (
                            <List>
                                {words.map((word, i) => (
                                    <SwipeAction
                                        key={word.id}
                                        leftActions={[{
                                            key: 'delete',
                                            text: 'Удалить',
                                            color: 'danger',
                                            onClick: makeOnDelete(word.title, () => deleteWord(word.id)),
                                        }]}
                                    >
                                        <List.Item
                                            description={word.pronunciation}
                                            extra={`${word.language?.title || ''}, ${word.topic?.title || ''}`}
                                            onClick={() => changeSelectedWord(i)}
                                        >
                                            {word.title}
                                        </List.Item>
                                    </SwipeAction>
                                ))}
                            </List>
                        ) : (
                            <ErrorBlock status={'empty'} title={'Пусто!'} description={'Ни одного слова ещё не добавлено!'} />
                        )}
                    </div>
                    <Button block onClick={() => changeSelectedWord(-1)} style={{ marginTop: 15 }}>Добавить слово</Button>
                </>
            )}
        </div>
    )
}

export default Words

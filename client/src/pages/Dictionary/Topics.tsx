import { Button, Dialog, ErrorBlock, Form, Input, List, NavBar, Space, SwipeAction } from 'antd-mobile'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { asyncCall } from '../../utils/functions'
import { Topic, TopicsService } from '../../api'

const makeOnDelete = (title: string, onDelete: () => void) => () => Dialog.show({
    closeOnMaskClick: true,
    closeOnAction: true,
    content: `Вы уверены, что хотите удалить тему "${title}"?`,
    actions: [
        { key: 'cancel', text: 'Отмена' },
        { key: 'delete', text: 'Удалить', bold: true, danger: true },
    ],
    onAction: (action) => action.key === 'delete' && onDelete(),
})

export const Topics = () => {
    const [form] = Form.useForm()

    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedTopicIdx, setSelectedTopicIdx] = useState<number>(null)

    const selectedTopic = useMemo(() => {
        if (selectedTopicIdx < 0 || selectedTopicIdx >= topics.length) return null

        return topics[selectedTopicIdx]
    }, [topics, selectedTopicIdx])

    const update = useCallback(() => asyncCall(async () => {
        const langs = await TopicsService.getAll()
        setTopics(langs)
    }), [])

    const changeSelectedTopic = useCallback((idx: number | null) => {
        if (idx !== null && idx >= 0 && idx < topics.length)
            form.setFieldsValue(topics[idx])
        else
            form.resetFields()
        setSelectedTopicIdx(idx)
    }, [form, topics])
    
    const deleteTopic = useCallback((topicId: number) => asyncCall(async () => {
        await TopicsService.delete(topicId)
        changeSelectedTopic(null)
        update()
    }), [update, changeSelectedTopic])
    
    const onFinish = useCallback((topic: any) => asyncCall(async () => {
        if (typeof topic.id === 'number')
            await TopicsService.update(topic.id, topic)
        else
            await TopicsService.insert(topic)
        changeSelectedTopic(null)
        update()
    }), [update, changeSelectedTopic])

    useEffect(update, [update])

    return (
        <div className={'df-page'}>
            {selectedTopicIdx !== null ? (
                <>
                    <NavBar onBack={() => changeSelectedTopic(null)} back={'Отмена'}>
                        {selectedTopic?.title || 'Добавить'}
                    </NavBar>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        footer={(
                            <Space direction={'vertical'} block>
                                <Button block color={'primary'} type={'submit'}>Сохранить</Button>
                                {selectedTopic && (
                                    <Button block color={'danger'} onClick={makeOnDelete(selectedTopic.title, () => deleteTopic(selectedTopic.id))}>
                                        Удалить
                                    </Button>
                                )}
                            </Space>
                        )}
                    >
                        <Form.Item hidden name={'id'}><Input /></Form.Item>
                        <Form.Item name={'title'} label={'Название темы'} rules={[{ required: true, message: 'Это обязательное поле!' }]}>
                            <Input placeholder={'Семья'} />
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <>
                    <div className={'df-scrollable'} style={{ flex: 1 }}>
                        {topics?.length > 0 ? (
                            <List>
                                {topics.map((topic, i) => (
                                    <SwipeAction
                                        key={topic.id}
                                        leftActions={[{
                                            key: 'delete',
                                            text: 'Удалить',
                                            color: 'danger',
                                            onClick: makeOnDelete(topic.title, () => deleteTopic(topic.id)),
                                        }]}
                                    >
                                        <List.Item onClick={() => changeSelectedTopic(i)}>{topic.title}</List.Item>
                                    </SwipeAction>
                                ))}
                            </List>
                        ) : (
                            <ErrorBlock status={'empty'} title={'Пусто!'} description={'Ни одна тема ещё не добавлена!'} />
                        )}
                    </div>
                    <Button block onClick={() => changeSelectedTopic(-1)} style={{ marginTop: 15 }}>Добавить тему</Button>
                </>
            )}
        </div>
    )
}

export default Topics

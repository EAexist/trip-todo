import { Avatar } from '@/components/Avatar'
import BottomSheetModal, {
    GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import { ControlledListItemInput } from '@/components/Input'
import ContentTitle, { Title } from '@/components/Layout/Content'
import { Screen } from '@/components/Screen'
import { TextInfoListItem } from '@/components/TextInfoListItem'
import { TransText } from '@/components/TransText'
import { useStores } from '@/models'
import { CATEGORY_TO_TITLE, Icon, Todo } from '@/models/Todo'
import { goBack, useNavigate } from '@/navigators'
import { useHeader } from '@/utils/useHeader'
import { withTodo } from '@/utils/withTodo'
import { useFocusEffect } from '@react-navigation/native'
import { Input, ListItem } from '@rneui/themed'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'
import {
    FlightTicketTodoEditScreen,
    FlightTodoEditScreen,
} from './Flight/FlightTodoEditScreen'

export const TodoCreateScreen = withTodo<'TodoCreate'>(({ todo, params }) => {
    const { navigateWithTrip } = useNavigate()
    const [isInitializing, setIsInitializing] = useState(params?.isInitializing)
    const { tripStore: { deleteTodo } } = useStores()

    useFocusEffect(
        useCallback(() => {
            console.log(`[TodoCreateScreen] isInitialized=${isInitializing}`)
            if (todo?.type === 'flight') {
                if (isInitializing) {
                    setIsInitializing(false)
                    if (todo?.departure === null) {
                        console.log('[TodoCreateScreen] todo?.departure === null')
                        navigateWithTrip('DepartureAirportSetting', { todoId: todo.id, callerName: params.callerName })
                    }

                } else {
                    deleteTodo(todo).then(() => goBack())
                }
            }
        }, [todo?.departure, isInitializing]),
    )


    // const handleBackPressBeforeNavigate = useCallback(async () => {
    //     if (!isConfirmed && isBeforeInitialization) await tripStore.deleteTodo(todo)
    // }, [tripStore, todo])


    return todo.type === 'custom' ? (
        <TodoEditScreenBase todo={todo} isBeforeInitialization={true} />
    ) : todo.type === 'flight' ? (
        <></>
    ) : (
        <TodoEditScreenBase todo={todo} isBeforeInitialization={true} />
    )
})

export const TodoEditScreen = withTodo<'TodoEdit'>(({ todo }) => {
    return todo.type === 'custom' ? (
        <CustomTodoEditScreen todo={todo} />
    ) : todo.type === 'flight' ? (
        <FlightTodoEditScreen todo={todo} />
    ) : todo.type === 'flightTicket' ? (
        <FlightTicketTodoEditScreen todo={todo} />
    ) : (
        <CustomTodoEditScreen todo={todo} />
    )
})

interface TodoEditScreenProps {
    todo: Todo
    isBeforeInitialization?: boolean
}

const TodoEditScreenBase: FC<TodoEditScreenProps> = props => {
    switch (props.todo.type) {
        case 'flight':
            return <FlightTodoEditScreen {...props} />
        // case 'train':
        //   return <FlightTodoEditScreen {...props} />
        default:
            return <CustomTodoEditScreen {...props} />
    }
}

export const CustomTodoEditScreen: FC<{
    todo: Todo
    isBeforeInitialization?: boolean
}> = observer(({ todo, isBeforeInitialization }) => {
    const [title, setTitle] = useState(todo.title)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const categoryBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const iconBottomSheetModalRef = useRef<BottomSheetModal>(null)
    const { navigateWithTrip } = useNavigate()
    const { tripStore } = useStores()

    const handleCompletePress = useCallback(() => {
        if (!todo.isCompleted) todo.complete()
        else todo.setIncomplete()
    }, [todo])

    const handleConfirmPress = useCallback(() => {
        setIsConfirmed(true)
        todo.setProp('title', title)
        tripStore.patchTodo(todo).then(() => {
            goBack()
        })
    }, [todo, title, setIsConfirmed])

    const handleIconPress = useCallback(() => {
        iconBottomSheetModalRef.current?.present()
    }, [iconBottomSheetModalRef])

    const handleNotePress = useCallback(() => {
        console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
        navigateWithTrip('TodoNote', {
            todoId: todo.id,
        })
    }, [navigateWithTrip, todo.id])

    const handleCategoryPress = useCallback(() => {
        categoryBottomSheetModalRef.current?.present()
    }, [categoryBottomSheetModalRef])

    const ICONS = [
        { name: '🛌', type: 'tossface' },
        { name: '💱', type: 'tossface' },
        { name: '💲', type: 'tossface' },
        { name: '📶', type: 'tossface' },
        { name: '📝', type: 'tossface' },
        { name: '🔌', type: 'tossface' },
        { name: '🧳', type: 'tossface' },
        { name: '🎒', type: 'tossface' },
        { name: '📸', type: 'tossface' },
        { name: '☂️', type: 'tossface' },
        { name: '💊', type: 'tossface' },
        { name: '🧴', type: 'tossface' },
        { name: '💄', type: 'tossface' },
        { name: '🪒', type: 'tossface' },
        { name: '🕶', type: 'tossface' },
        { name: '✈️', type: 'tossface' },
        { name: '🛫', type: 'tossface' },
        { name: '🚄', type: 'tossface' },
        { name: '🚆', type: 'tossface' },
        { name: '🚕', type: 'tossface' },
        { name: '⛴', type: 'tossface' },
        { name: '🎢', type: 'tossface' },
        { name: '⛩', type: 'tossface' },
        { name: '🐶', type: 'tossface' },
        { name: '🐱', type: 'tossface' },
        { name: '⭐️', type: 'tossface' },]

    const iconMenu: { icon: Icon }[] = ICONS.map(icon => ({ icon }))

    const handlePress = useCallback(
        (icon: Icon) => {
            todo.setProp('icon', icon)
            iconBottomSheetModalRef.current?.close()
        },
        [iconBottomSheetModalRef, todo],
    )
    const renderIconListItem: ListRenderItem<{ icon: Icon }> = useCallback(
        ({ item }) => {
            return (
                <TouchableOpacity onPress={() => handlePress(item.icon)}>
                    <Avatar
                        // iconId={item.iconId}
                        icon={item.icon}
                        fontSize={28}
                        size={'xlarge'}
                        containerStyle={$iconAvataContainerStyle}
                    />
                </TouchableOpacity>
            )
        },
        [],
    )

    /* categoryMenu */
    type CategoryListItemData = {
        title: string
        category: string
        isActive?: boolean
    }
    const renderCategoryListItem: ListRenderItem<CategoryListItemData> =
        useCallback(
            ({ item }) => {
                const handlePress = () => {
                    console.log(
                        `[bottomSheetModalRef.current] ${categoryBottomSheetModalRef.current}`,
                    )
                    todo.setProp('category', item.category)
                    categoryBottomSheetModalRef.current?.close()
                }
                return (
                    <ListItem onPress={handlePress} style={$s}>
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        {item.isActive && (
                            <ListItem.Chevron primary onPress={handlePress} name="check" />
                        )}
                    </ListItem>
                )
            },
            [categoryBottomSheetModalRef, todo],
        )

    const handleBackPressBeforeNavigate = useCallback(async () => {
        if (!isConfirmed && isBeforeInitialization) await tripStore.deleteTodo(todo)
    }, [tripStore, todo])

    useHeader({ onBackPressBeforeNavigate: handleBackPressBeforeNavigate })

    const [isFocused, setIsFocused] = useState(false)
    return (
        <GestureHandlerRootViewWrapper>
            <Screen>
                <Title>
                    <ListItem containerStyle={$listItemContainerStyle}>
                        <TouchableOpacity onPress={handleIconPress}>
                            <Avatar icon={todo.icon}
                                fontSize={28}
                                size={'xlarge'} />
                        </TouchableOpacity>
                        <ListItem.Content>
                            <ControlledListItemInput
                                setValue={setTitle}
                                value={title}
                                placeholder={'할 일 이름 입력'}
                                autoFocus={isBeforeInitialization}
                                onBlur={() => setIsFocused(false)}
                                onFocus={() => setIsFocused(true)}
                                inputContainerStyle={{ borderBottomWidth: isFocused ? 2 : 0 }}
                                primary={isFocused}
                            />
                        </ListItem.Content>
                    </ListItem>
                </Title>
                <TextInfoListItem
                    title={'상태'}
                    rightContent={
                        <ListItem.CheckBox
                            onPress={handleCompletePress}
                            checked={todo.isCompleted}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            size={24}
                        />
                    }>
                    <TransText primary={todo.isCompleted}>
                        {todo.isCompleted ? '완료' : '미완료'}
                    </TransText>
                </TextInfoListItem>
                <TextInfoListItem
                    title={'카테고리'}
                    rightContent={<ListItem.Chevron />}
                    onPress={handleCategoryPress}>
                    <TransText>{todo.categoryTitle || '카테고리 선택'}</TransText>
                </TextInfoListItem>
                <TextInfoListItem
                    onPress={handleNotePress}
                    title={'메모'}
                    rightContent={<ListItem.Chevron />}>
                    <TransText primary={!todo.note} numberOfLines={2}>
                        {todo.note || '메모를 남겨보세요'}
                    </TransText>
                </TextInfoListItem>
                <Fab.Container>
                    <Fab.Button disabled={title.length == 0} onPress={handleConfirmPress} title={'확인'} />
                </Fab.Container>
                <IconDropdownBottomSheet />
                <CategoryDropdownBottomSheet />
                <BottomSheetModal ref={iconBottomSheetModalRef}>
                    <ContentTitle title={'아이콘 선택'} />
                    <FlatList
                        data={iconMenu}
                        renderItem={renderIconListItem}
                        keyExtractor={item => item.icon.name}
                        numColumns={4}
                        columnWrapperStyle={$d}
                        contentContainerStyle={$s}
                    />
                </BottomSheetModal>
                <BottomSheetModal ref={categoryBottomSheetModalRef}>
                    <ContentTitle title={'카테고리 선택'} />
                    <FlatList
                        data={Object.entries(CATEGORY_TO_TITLE).map(
                            ([_category, title]) => ({
                                category: _category,
                                title,
                                isActive: _category === todo.category,
                            }),
                        )}
                        renderItem={renderCategoryListItem}
                        keyExtractor={item => item.category}
                    />
                </BottomSheetModal>
            </Screen>
        </GestureHandlerRootViewWrapper>
    )
})

const IconDropdownBottomSheet = () => {
    return <></>
}

const CategoryDropdownBottomSheet = () => {
    return <></>
}

const $listItemContainerStyle: ViewStyle = {
    height: 60,
}

const $d: ViewStyle = {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
}

const $s: ViewStyle = {
    gap: 32,
}

const $iconAvataContainerStyle: ViewStyle = {
    // width: 72,
    // height: 72,
    // height: 64
}

import {Avatar} from '@/components/Avatar'
import BottomSheetModal, {
  GestureHandlerRootViewWrapper,
} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import {Input} from '@/components/Input'
import ContentTitle, {Title} from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TextInfoListItem} from '@/components/TextInfoListItem'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {CATEGORY_TO_TITLE, Todo} from '@/models/Todo'
import {AppStackScreenProps, goBack, useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useTodo} from '@/utils/useTodo'
import BottomSheet from '@gorhom/bottom-sheet'
import {useFocusEffect} from '@react-navigation/native'
import {ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useRef, useState} from 'react'
import {
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

export const TodoCreateScreen: FC<AppStackScreenProps<'TodoCreate'>> = observer(
  props => {
    const todo = useTodo(props.route)
    return !!todo ? (
      <TodoEditScreenBase todo={todo} isBeforeInitialization={true} />
    ) : (
      <></>
    )
  },
)

export const TodoEditScreen: FC<AppStackScreenProps<'TodoEdit'>> = observer(
  props => {
    const todo = useTodo(props.route)
    return !!todo ? <TodoEditScreenBase todo={todo} /> : <></>
  },
)

export const TodoEditScreenBase: FC<{
  todo: Todo
  isBeforeInitialization?: boolean
}> = observer(({todo, isBeforeInitialization}) => {
  // const [note, setNote] = useState('')
  const [title, setTitle] = useState(todo.title)
  const [isConfirmed, setIsConfirmed] = useState(false)
  // const [category, setCategory] = useState(todo.category)
  const categoryBottomSheetModalRef = useRef<BottomSheet>(null)
  const iconBottomSheetModalRef = useRef<BottomSheet>(null)
  const {navigateWithTrip} = useNavigate()
  const {tripStore} = useStores()

  const handleCompletePress = useCallback(() => {
    if (!todo.isCompleted) todo.complete()
    else todo.setIncomplete()
  }, [todo])

  const handleConfirmPress = useCallback(() => {
    setIsConfirmed(true)
    todo.setProp('title', title)
    //   todo.setProp('note', note)
    tripStore.patchTodo(todo).then(() => {
      goBack()
    })
  }, [todo, title, setIsConfirmed])

  const handleIconPress = useCallback(() => {
    iconBottomSheetModalRef.current?.expand()
  }, [iconBottomSheetModalRef])

  const handleNotePress = useCallback(() => {
    console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
    navigateWithTrip('TodoNote', {
      todoId: todo.id,
    })
  }, [navigateWithTrip, todo.id])

  const handleCategoryPress = useCallback(() => {
    categoryBottomSheetModalRef.current?.expand()
  }, [categoryBottomSheetModalRef])

  const iconMenu = [
    {iconId: '🛌'},
    {iconId: '📖'},
    {iconId: '💱'},
    {iconId: '📶'},
    {iconId: '📝'},
    {iconId: '🧴'},
    {iconId: '🔌'},
    {iconId: '🕶'},
    {iconId: '🧳'},
    {iconId: '☂️'},
  ]

  const handlePress = useCallback(
    (iconId: string) => {
      todo.setProp('iconId', iconId)
      iconBottomSheetModalRef.current?.close()
    },
    [iconBottomSheetModalRef, todo],
  )
  const renderIconListItem: ListRenderItem<{iconId: string}> = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity onPress={() => handlePress(item.iconId)}>
          <Avatar
            iconId={item.iconId}
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
      ({item}) => {
        const handlePress = () => {
          console.log(
            `[bottomSheetModalRef.current] ${categoryBottomSheetModalRef.current}`,
          )
          // setCategory(item.category)
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

  useHeader({onBackPressBeforeNavigate: handleBackPressBeforeNavigate})

  return (
    <GestureHandlerRootViewWrapper>
      <Screen>
        <Title>
          <ListItem containerStyle={$listItemContainerStyle}>
            <TouchableOpacity onPress={handleIconPress}>
              <Avatar iconId={todo.iconId} size="xlarge" />
            </TouchableOpacity>
            <ListItem.Content>
              <ListItem.Title>
                <Input
                  setValue={setTitle}
                  value={title}
                  placeholder={'할 일 이름 입력'}
                  autoFocus={isBeforeInitialization}
                />
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Title>
        <TextInfoListItem
          onPress={handleNotePress}
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
          // onPress={handleInputPress}
          rightContent={<ListItem.Chevron />}>
          <TransText primary>{todo.note || '메모를 남겨보세요'}</TransText>
        </TextInfoListItem>
        <Fab.Container>
          <Fab.Button
            onPress={handleConfirmPress}
            title={'확인'}
            disabled={title === todo.title}
          />
        </Fab.Container>
        <BottomSheetModal
          ref={iconBottomSheetModalRef}
          // onChange={handleBottomSheetModalChange}
        >
          <ContentTitle title={'아이콘 선택'} />
          <FlatList
            data={iconMenu}
            renderItem={renderIconListItem}
            keyExtractor={item => item.iconId}
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

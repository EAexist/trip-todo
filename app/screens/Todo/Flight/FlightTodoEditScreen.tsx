import {GestureHandlerRootViewWrapper} from '@/components/BottomSheetModal'
import * as Fab from '@/components/Fab'
import {Screen} from '@/components/Screen'
import {TextInfoListItem} from '@/components/TextInfoListItem'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {Todo} from '@/models/Todo'
import {AppStackParamList, goBack, useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {Dispatch, FC, SetStateAction, useCallback, useState} from 'react'
import {View, ViewStyle} from 'react-native'

export const TodoConfirmListItem: FC<{
  todo: Todo
  isCompleted: boolean
  onChange: () => void
}> = ({isCompleted, onChange}) => {
  //   const handleCompletePress = useCallback(() => {
  //     setIsCompleted(prev => !prev)
  //   }, [setIsCompleted])

  return (
    <TextInfoListItem
      title={'상태'}
      rightContent={
        <ListItem.CheckBox
          onPress={onChange}
          checked={isCompleted}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          size={24}
        />
      }>
      <TransText primary={isCompleted}>
        {isCompleted ? '완료' : '미완료'}
      </TransText>
    </TextInfoListItem>
  )
}

const useTodoConfirmListItem = (
  todo: Todo,
  confirmScreen: keyof AppStackParamList,
) => {
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted)

  const {
    tripStore: {patchTodo},
  } = useStores()
  const {navigateWithTrip} = useNavigate()

  const handleConfirm = useCallback(async () => {
    console.log(
      `[confirmCompleteNavigate] todo.isCompleted=${todo.isCompleted} isCompleted=${isCompleted}`,
    )
    if (!todo.isCompleted && isCompleted) {
      todo.complete()
      patchTodo(todo).then(() => {
        navigateWithTrip(confirmScreen, {todoId: todo.id})
      })
    } else if (todo.isCompleted && !isCompleted) {
      todo.setIncomplete()
      patchTodo(todo).then(() => {
        goBack()
      })
    } else {
      goBack()
    }
  }, [patchTodo, todo, todo.isCompleted, isCompleted])

  return {
    isCompleted,
    setIsCompleted,
    handleConfirm,
  }
}

export const FlightTodoEditScreen: FC<{
  todo: Todo
  isBeforeInitialization?: boolean
}> = observer(({todo, isBeforeInitialization = false}) => {
  //   const [isConfirmed, setIsConfirmed] = useState(false)
  //   const [isCompleted, setIsCompleted] = useState(false)
  const {navigateWithTrip} = useNavigate()
  const {tripStore} = useStores()

  //   const [isCompleted, setIsCompleted] = useState(false)

  const {
    tripStore: {patchTodo},
  } = useStores()

  const {isCompleted, setIsCompleted, handleConfirm} = useTodoConfirmListItem(
    todo,
    'ConfirmFlight',
  )

  //   const handleConfirm = useCallback(() => {
  //     console.log(
  //       `[confirmCompleteNavigate] todo.isCompleted=${todo.isCompleted} isCompleted=${isCompleted}`,
  //     )
  //     if (!todo.isCompleted && isCompleted) {
  //       todo.complete()
  //       patchTodo(todo).then(() => {
  //         navigateWithTrip('ConfirmFlight', {todoId: todo.id})
  //       })
  //     } else if (todo.isCompleted && !isCompleted) {
  //       todo.setIncomplete()
  //       patchTodo(todo).then(() => {
  //         goBack()
  //       })
  //     }
  //   }, [todo.isCompleted, isCompleted])

  //   const handlePress = useCallback(() => {
  //     // setIsConfirmed(true)
  //     handleConfirm()
  //   }, [])

  const handleNotePress = useCallback(() => {
    console.log(`handleInputPress navigateWithTrip to [TodoNote]`)
    navigateWithTrip('TodoNote', {
      todoId: todo.id,
    })
  }, [navigateWithTrip, todo.id])

  const handleDeparturePress = useCallback(() => {
    navigateWithTrip('FlightDepartureSetting')
  }, [])

  const handleArrivalPress = useCallback(() => {
    navigateWithTrip('FlightArrivalSetting')
  }, [])

  //   const handleBackPressBeforeNavigate = useCallback(async () => {
  //     // if (isBeforeInitialization && !isConfirmed) await tripStore.deleteTodo(todo)
  //     if (isBeforeInitialization) await tripStore.deleteTodo(todo)
  //   }, [isBeforeInitialization])

  useHeader({
    // onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
    centerComponent: (
      <View style={$headerTitleStyle}>
        {/* <Avatar iconId={'✈️'} size="small" /> */}
        {/* <Icon name={'✈️'} /> */}
        <TransText>✈️ 항공권 예약</TransText>
      </View>
    ),
    centerContainerStyle: {flexGrow: 1, flexBasis: 1, justifyContent: 'center'},
  })

  const handleChange = useCallback(() => {
    setIsCompleted(prev => !prev)
    console.log(isCompleted)
  }, [setIsCompleted, isCompleted])
  return (
    <GestureHandlerRootViewWrapper>
      <Screen>
        <TextInfoListItem
          title={'출발'}
          rightContent={<ListItem.Chevron />}
          onPress={handleDeparturePress}>
          <TransText style={{fontWeight: 600}}>
            {todo.departure?.name || '출발지 입력하기'}
          </TransText>
        </TextInfoListItem>
        <TextInfoListItem
          title={'도착'}
          rightContent={<ListItem.Chevron />}
          onPress={handleArrivalPress}>
          <TransText style={{fontWeight: 600}}>
            {todo.arrival?.name || '도착지 입력하기'}
          </TransText>
        </TextInfoListItem>
        {/* <Divider /> */}
        <TodoConfirmListItem
          todo={todo}
          isCompleted={isCompleted}
          onChange={handleChange}
        />
        {/* <TextInfoListItem
          title={'상태'}
          rightContent={
            <ListItem.CheckBox
              onPress={handleCompletePress}
              checked={isCompleted}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              size={24}
            />
          }>
          <TransText primary={isCompleted}>
            {isCompleted ? '완료' : '미완료'}
          </TransText>
        </TextInfoListItem> */}
        <TextInfoListItem
          onPress={handleNotePress}
          title={'메모'}
          rightContent={<ListItem.Chevron />}>
          <TransText primary>{todo.note || '메모를 남겨보세요'}</TransText>
        </TextInfoListItem>
        <Fab.Container>
          <Fab.Button onPress={handleConfirm} title={'확인'} />
        </Fab.Container>
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

const $headerTitleStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}

const $iconAvataContainerStyle: ViewStyle = {
  // width: 72,
  // height: 72,
  // height: 64
}

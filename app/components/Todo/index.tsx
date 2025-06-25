import {useStores} from '@/models'
import {PresetTodoContent, Todo} from '@/models/Todo'
import {Preset} from '@/models/TripStore'
import {useNavigate} from '@/navigators'
import {Trans} from '@lingui/react/macro'
import {Icon, ListItem, ListItemProps, useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, ReactNode, useCallback, useEffect, useState} from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import {Avatar, AvatarProps} from '../Avatar'
import {ListItemCaption} from '../ListItemCaption'
import {useFocusEffect} from '@react-navigation/native'

interface TodoBaseProps extends Pick<AvatarProps, 'iconId'>, ListItemProps {
  title: string
  subtitle?: string
  caption?: string
  rightContent?: ReactNode
  // avatarStyle?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  avatarProps?: AvatarProps
  titleStyle?: TextStyle
  onPressContent?: () => void
}

export const TodoBase: FC<TodoBaseProps> = ({
  iconId,
  title,
  subtitle,
  caption,
  rightContent,
  contentStyle,
  avatarProps,
  titleStyle,
  onPressContent,
  ...props
}) => {
  return (
    <ListItem {...props}>
      <Avatar
        iconId={iconId}
        size="small"
        {...avatarProps}
        // {...(avatarStyle && {containerStyle: avatarStyle})}
      />
      <ListItem.Content
        style={contentStyle || {}}
        onPress={() => {
          console.log('HII')
        }}>
        <ListItem.Title style={titleStyle || {}}>
          <Trans>{title}</Trans>
          {!!caption && <ListItemCaption>{caption}</ListItemCaption>}
        </ListItem.Title>
        {!!subtitle && (
          <ListItem.Subtitle>
            <Trans>{subtitle}</Trans>
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

export type TodoProps = {id: string} & Pick<
  TodoBaseProps,
  'iconId' | 'title' | 'subtitle'
>
// {
//   iconId: string
//   iconName?: string
//   title: string
//   subtitle?: string
//   rightContent?: ReactNode
//   onPress?: () => void
// }

export const AddTodo: FC<{todo: PresetTodoContent}> = ({todo}) => {
  const [isAdded, setIsAdded] = useState(true)

  const handlePress = useCallback(() => {
    setIsAdded(!isAdded)
  }, [isAdded, setIsAdded])

  return (
    <TodoBase
      caption={'추가함'}
      onPress={handlePress}
      // useDisabledStyle
      {...todo}
    />
  )
}

export const AddPresetTodo: FC<{preset: Preset}> = observer(({preset}) => {
  const handlePress = useCallback(() => {
    preset.toggleAddFlag()
  }, [preset])

  const {
    theme: {colors},
  } = useTheme()
  return (
    <TodoBase
      rightContent={
        <ListItem.CheckBox
          onPress={handlePress}
          checked={preset.isFlaggedToAdd}
          checkedIcon={<Icon name="check-circle" />}
          uncheckedIcon={
            <Icon name="check-circle-outline" color={colors.grey1} />
          }
        />
      }
      onPress={handlePress}
      {...(!preset.isFlaggedToAdd && {
        avatarProps: {avatarStyle: styles.disabled},
        contentStyle: styles.disabled,
      })}
      {...preset.item}
    />
  )
})

const useDelayedEdit = ({
  initialState = false,
  displayDelay = 500,
  //   isComplete,
  setComplete,
}: {
  initialState?: boolean
  displayDelay?: number
  //   isComplete: boolean
  setComplete: (isComplete: boolean) => void
}) => {
  const [displayComplete, setDisplayComplete] = useState(initialState)

  useEffect(() => {
    {
      const sleep = new Promise(resolve => setTimeout(resolve, displayDelay))
      sleep.then(() => {
        if (displayComplete) setComplete(true)
        else setComplete(false)
      })
    }
  }, [displayComplete, displayDelay])

  return {displayComplete, setDisplayComplete}
}

const styles = StyleSheet.create({
  disabled: {opacity: 0.5},
})

export const CompleteTodo: FC<{todo: Todo}> = observer(({todo}) => {
  const displayDelay = 500
  const {navigateWithTrip} = useNavigate()
  const {tripStore} = useStores()

  const [displayComplete, setDisplayComplete] = useState(todo.isCompleted)

  useFocusEffect(
    useCallback(() => {
      //   console.log('HELLO')
      if (displayComplete !== todo.isCompleted) {
        const sleep = new Promise(resolve => setTimeout(resolve, displayDelay))
        sleep.then(() => {
          if (displayComplete) todo.complete()
          else todo.setIncomplete()
          tripStore.patchTodo(todo)
        })
      }
    }, [displayComplete]),
  )

  //   useEffect(() => {
  //     if (displayComplete != todo.isCompleted)
  //       setDisplayComplete(todo.isCompleted)
  //   }, [displayComplete, todo.isCompleted])

  const handleCompletePress = useCallback(() => {
    if (!todo.isCompleted) {
      switch (todo.type) {
        case 'passport':
          todo.complete()
          tripStore.patchTodo(todo).then(() => {
            navigateWithTrip('ConfirmPassport', {todoId: todo.id})
          })
          break
        case 'flight':
          todo.complete()
          tripStore.patchTodo(todo).then(() => {
            navigateWithTrip('ConfirmFlight', {todoId: todo.id})
          })
          break
        default:
          setDisplayComplete(prev => !prev)
          break
      }
    }
    // setDisplayComplete(prev => !prev)
    else setDisplayComplete(prev => !prev)
    // if (!todo.isCompleted) todo.complete()
    // else todo.setIncomplete()
  }, [todo, navigateWithTrip])

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      console.log(todo.title)
      e.stopPropagation()
      navigateWithTrip('TodoEdit', {todoId: todo.id})
      //   tripStore.setActiveItem(todo)
    },
    [tripStore, todo],
  )

  return (
    <TodoBase
      rightContent={
        <ListItem.CheckBox
          onPress={handleCompletePress}
          checked={displayComplete}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
        />
      }
      subtitle={todo.note !== '' ? todo.note : undefined}
      onPress={handlePress}
      {...todo}
    />
  )
})

// export const PassportTodo: FC<{todo: Todo}> = ({todo}) => {
//   const {tripStore} = useStores()

//   const handleCompletePress = useCallback(() => {
//     if(todo.isCompleted)

//       else
//     navigateWithTrip('ConfirmPassport', {todoId: todo.id})
//   }, [todo.id])

//   const handlePress = useCallback(() => {
//     console.log(todo.title)
//     tripStore.setActiveItem(todo)
//   }, [tripStore, todo])

//   return (
//     <TodoBase
//       rightContent={
//         <ListItem.CheckBox
//           onPress={handleCompletePress}
//           checked={todo.isCompleted}
//           checkedIcon="dot-circle-o"
//           uncheckedIcon="circle-o"
//         />
//       }
//       onPressContent={handlePress}
//       {...todo}
//     />
//   )
// }

export const AccomodationTodo: FC<{todo: Todo}> = ({todo}) => {
  const {navigateWithTrip} = useNavigate()
  const handlePress = useCallback(() => {
    navigateWithTrip('AccomodationPlan')
  }, [navigateWithTrip])

  return (
    <TodoBase
      rightContent={<ListItem.Chevron size={32} onPress={handlePress} />}
      onPress={handlePress}
      {...todo}
    />
  )
}

export const ReorderTodo: FC<{todo: Todo}> = ({todo}) => {
  return (
    <TodoBase
      rightContent={<ListItem.Chevron name="drag-handle" type="material" />}
      {...todo}
    />
  )
}

export const DeleteTodo: FC<{todo: Todo}> = observer(({todo}) => {
  const setComplete = useCallback(
    (isCompleted: boolean) => {
      todo.setProp('isFlaggedToDelete', isCompleted)
    },
    [todo],
  )

  const {displayComplete, setDisplayComplete} = useDelayedEdit({
    setComplete,
  })
  const {
    theme: {colors},
  } = useTheme()
  const handlePress = useCallback(() => {
    setDisplayComplete(prev => !prev)
  }, [setDisplayComplete])

  return (
    <TodoBase
      rightContent={
        <ListItem.CheckBox
          onPress={handlePress}
          checked={displayComplete}
          checkedIcon={
            <Icon name="undo" type="material" color={colors.text.secondary} />
          }
          uncheckedIcon={
            <Icon name="delete" type="material" color={colors.error} />
          }
        />
      }
      onPress={handlePress}
      caption={todo.isFlaggedToDelete ? '삭제함' : undefined}
      {...(todo.isFlaggedToDelete && {
        avatarStyle: styles.disabled,
        contentStyle: styles.disabled,
      })}
      {...todo}
    />
  )
})

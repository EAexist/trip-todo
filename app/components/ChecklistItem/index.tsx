import {useStores} from '@/models'
import {ChecklistItem} from '@/models/ChecklistItem'
import {Preset} from '@/models/ChecklistStore'
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

interface ChecklistItemBaseProps
  extends Pick<AvatarProps, 'iconId'>,
    ListItemProps {
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

export const ChecklistItemBase: FC<ChecklistItemBaseProps> = ({
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
          {caption && <ListItemCaption>{caption}</ListItemCaption>}
        </ListItem.Title>
        {subtitle && (
          <ListItem.Subtitle>
            <Trans>{subtitle}</Trans>
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

export type ChecklistItemProps = {id: string} & Pick<
  ChecklistItemBaseProps,
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

export const AddChecklistItem: FC<{item: ChecklistItem}> = ({item}) => {
  const [isAdded, setIsAdded] = useState(true)

  const handlePress = useCallback(() => {
    setIsAdded(!isAdded)
  }, [isAdded, setIsAdded])

  return (
    <ChecklistItemBase
      caption={'추가함'}
      onPress={handlePress}
      // useDisabledStyle
      {...item}
    />
  )
}

export const AddPresetChecklistItem: FC<{preset: Preset}> = observer(
  ({preset}) => {
    const handlePress = useCallback(() => {
      preset.toggleAddFlag()
    }, [preset])

    const {
      theme: {colors},
    } = useTheme()
    return (
      <ChecklistItemBase
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
          avatarStyle: styles.disabled,
          contentStyle: styles.disabled,
        })}
        {...preset.item}
      />
    )
  },
)

const useDelayedEdit = ({
  initialState = false,
  displayDelay = 500,
  setComplete,
}: {
  initialState?: boolean
  displayDelay?: number
  setComplete: (isComplete: boolean) => void
}) => {
  const [displayComplete, setDisplayComplete] = useState(initialState)

  useEffect(() => {
    const sleep = new Promise(resolve => setTimeout(resolve, displayDelay))
    sleep.then(() => {
      if (displayComplete) setComplete(true)
      else setComplete(false)
    })
  }, [displayComplete, displayDelay, setComplete])

  return {displayComplete, setDisplayComplete}
}

const styles = StyleSheet.create({
  disabled: {opacity: 0.5},
})

export const CompleteChecklistItem: FC<{item: ChecklistItem}> = observer(
  ({item}) => {
    const displayDelay = 500
    const {navigateWithChecklist} = useNavigate()
    const {checklistStore} = useStores()

    const [displayComplete, setDisplayComplete] = useState(item.isCompleted)

    useEffect(() => {
      const sleep = new Promise(resolve => setTimeout(resolve, displayDelay))
      sleep.then(() => {
        if (displayComplete) item.complete()
        else item.setIncomplete()
      })
    }, [item, displayComplete])

    const handleCompletePress = useCallback(() => {
      console.log(item.title)
      if (!item.isCompleted && item.type === 'passport')
        navigateWithChecklist('ConfirmPassport', {checklistItemId: item.id})
      else setDisplayComplete(prev => !prev)
      // if (!item.isCompleted) item.complete()
      // else item.setIncomplete()
    }, [item, navigateWithChecklist])

    const handlePress = useCallback(
      (e: GestureResponderEvent) => {
        console.log(item.title)
        e.stopPropagation()
        checklistStore.setActiveItem(item)
      },
      [checklistStore, item],
    )

    return (
      <ChecklistItemBase
        rightContent={
          <ListItem.CheckBox
            onPress={handleCompletePress}
            checked={displayComplete}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        }
        subtitle={item.note !== '' ? item.note : undefined}
        onPress={handlePress}
        {...item}
      />
    )
  },
)

// export const PassportChecklistItem: FC<{item: ChecklistItem}> = ({item}) => {
//   const {checklistStore} = useStores()

//   const handleCompletePress = useCallback(() => {
//     if(item.isCompleted)

//       else
//     navigateWithChecklist('ConfirmPassport', {checklistItemId: item.id})
//   }, [item.id])

//   const handlePress = useCallback(() => {
//     console.log(item.title)
//     checklistStore.setActiveItem(item)
//   }, [checklistStore, item])

//   return (
//     <ChecklistItemBase
//       rightContent={
//         <ListItem.CheckBox
//           onPress={handleCompletePress}
//           checked={item.isCompleted}
//           checkedIcon="dot-circle-o"
//           uncheckedIcon="circle-o"
//         />
//       }
//       onPressContent={handlePress}
//       {...item}
//     />
//   )
// }

export const AccomodationChecklistItem: FC<{item: ChecklistItem}> = ({
  item,
}) => {
  const {navigateWithChecklist} = useNavigate()
  const handlePress = useCallback(() => {
    navigateWithChecklist('AccomodationPlan')
  }, [navigateWithChecklist])

  return (
    <ChecklistItemBase
      rightContent={<ListItem.Chevron size={32} onPress={handlePress} />}
      onPress={handlePress}
      {...item}
    />
  )
}

export const ReorderChecklistItem: FC<{item: ChecklistItem}> = ({item}) => {
  return (
    <ChecklistItemBase
      rightContent={<ListItem.Chevron name="drag-handle" type="material" />}
      {...item}
    />
  )
}

export const DeleteChecklistItem: FC<{item: ChecklistItem}> = observer(
  ({item}) => {
    const setComplete = useCallback(
      (isCompleted: boolean) => {
        item.setProp('isFlaggedToDelete', isCompleted)
      },
      [item],
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
      <ChecklistItemBase
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
        caption={item.isFlaggedToDelete ? '삭제함' : undefined}
        {...(item.isFlaggedToDelete && {
          avatarStyle: styles.disabled,
          contentStyle: styles.disabled,
        })}
        {...item}
      />
    )
  },
)

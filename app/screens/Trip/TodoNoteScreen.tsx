import * as Fab from '@/components/Fab'
import {Input} from '@/components/Input'
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {Todo, TodoSnapshotIn} from '@/models/Todo'
import {AppStackScreenProps, goBack} from '@/navigators'
import {Trans} from '@lingui/react/macro'
import {ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useState} from 'react'
import {ViewStyle} from 'react-native'
import {Avatar} from '../../components/Avatar'
import {TransText} from '../../components/TransText'
import {Title} from '@/components/Layout/Content'
import {useTodo} from '@/utils/useTodo'

export const TodoNoteScreenBase: FC<{
  todo: Todo
  handleCompletePress: () => void
}> = observer(({todo, handleCompletePress}) => {
  const [value, setValue] = useState(todo.note)

  // useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
  return (
    <Screen>
      <ListItem containerStyle={$listItemContainerStyle}>
        <Avatar iconId={todo.iconId} size="xlarge" />
        <ListItem.Content>
          {true && (
            <ListItem.Subtitle>
              <Trans>{todo.categoryTitle}</Trans>
            </ListItem.Subtitle>
          )}
          <ListItem.Title>
            <TransText h2>{todo.title}</TransText>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Input setValue={setValue} value={value} />
      <Fab.Container>
        <Fab.Button onPress={handleCompletePress} title={'확인'} />
      </Fab.Container>
    </Screen>
  )
})

export const TodoNoteScreen: FC<AppStackScreenProps<'TodoNote'>> = observer(
  props => {
    const todo = useTodo(props.route)
    return !!todo ? <_TodoNoteScreen todo={todo} /> : <></>
  },
)

export const _TodoNoteScreen: FC<{todo: Todo}> = observer(({todo}) => {
  const [value, setValue] = useState(todo.note)

  const handleCompletePress = useCallback(() => {
    todo.setProp('note', value)
    goBack()
  }, [todo, value])

  // useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
  return (
    <Screen>
      <Title>
        <ListItem containerStyle={$listItemContainerStyle}>
          <Avatar iconId={todo.iconId} size="xlarge" />
          <ListItem.Content>
            {true && (
              <ListItem.Subtitle>
                <Trans>{todo.categoryTitle}</Trans>
              </ListItem.Subtitle>
            )}
            <ListItem.Title>
              <TransText h2>{todo.title}</TransText>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Title>
      <Input setValue={setValue} value={value} multiline />
      <Fab.Container>
        <Fab.Button onPress={handleCompletePress} title={'확인'} />
      </Fab.Container>
    </Screen>
  )
})

const $listItemContainerStyle: ViewStyle = {
  height: 60,
}

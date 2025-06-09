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
  item: Todo
  handleCompletePress: () => void
}> = observer(({item, handleCompletePress}) => {
  const [value, setValue] = useState(item.note)

  // useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
  return (
    <Screen>
      <ListItem containerStyle={$listItemContainerStyle}>
        <Avatar iconId={item.iconId || '🧐'} size="xlarge" />
        <ListItem.Content>
          {true && (
            <ListItem.Subtitle>
              <Trans>{item.categoryTitle}</Trans>
            </ListItem.Subtitle>
          )}
          <ListItem.Title>
            <TransText h2>{item.title}</TransText>
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

export const TodoNoteScreen: FC<
  AppStackScreenProps<'TodoNote'>
> = observer(({route}) => {
  const item = useTodo(route)
  const [value, setValue] = useState(item.note)

  const handleCompletePress = useCallback(() => {
    item.setProp('note', value)
    goBack()
  }, [item, value])

  // useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
  return (
    <Screen>
      <Title>
        <ListItem containerStyle={$listItemContainerStyle}>
          <Avatar iconId={item.iconId} size="xlarge" />
          <ListItem.Content>
            {true && (
              <ListItem.Subtitle>
                <Trans>{item.categoryTitle}</Trans>
              </ListItem.Subtitle>
            )}
            <ListItem.Title>
              <TransText h2>{item.title}</TransText>
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

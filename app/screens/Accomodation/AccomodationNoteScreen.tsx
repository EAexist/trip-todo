import {Avatar} from '@/components/Avatar'
import * as Fab from '@/components/Fab'
import {Title} from '@/components/Layout/Content'
import {Note} from '@/components/Note'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {AccomodationItem} from '@/models/AccomodationItem'
import {AppStackScreenProps, goBack} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {Trans} from '@lingui/react/macro'
import {ListItem} from '@rneui/base'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useState} from 'react'
import {ViewStyle} from 'react-native'

export const AccomodationNoteScreen: FC<
  AppStackScreenProps<'AccomodationNote'>
> = observer(({route}) => {
  const {tripStore} = useStores()
  const {accomodationId} = route.params
  const item = tripStore.accomodation.get(accomodationId) as AccomodationItem
  const [value, setValue] = useState(item?.note)

  const handleCompletePress = useCallback(() => {
    item?.setProp('note', value)
    tripStore.patchAccomodation(item)
    goBack()
  }, [item, value])

  useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})

  const [isFocused, setIsFocused] = useState(false)
  const handleChangeNote = (value: string) => item.setProp('note', value)

  return (
    <Screen>
      <Title>
        <ListItem containerStyle={$listItemContainerStyle}>
          <Avatar iconId={'🌃'} size="xlarge" />
          <ListItem.Content>
            {true && (
              <ListItem.Subtitle>
                <Trans>{item?.nightsParsed}</Trans>
              </ListItem.Subtitle>
            )}
            <ListItem.Title>
              <TransText h2>{item?.title}</TransText>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Title>
      <Note
        onChangeNote={handleChangeNote}
        initialValue={item.note}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      {isFocused && (
        <Fab.Container>
          <Fab.Button title={'확인'} />
        </Fab.Container>
      )}
    </Screen>
  )
})

const $listItemContainerStyle: ViewStyle = {
  paddingBottom: 16,
}

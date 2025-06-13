import {Avatar} from '@/components/Avatar'
import {Input} from '@/components/Input'
import {Title} from '@/components/Layout/Content'
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
      <Input
        setValue={setValue}
        value={value}
        label="메모"
        placeholder="메모를 입력하세요"
      />
    </Screen>
  )
})

const $listItemContainerStyle: ViewStyle = {
  paddingBottom: 16,
}

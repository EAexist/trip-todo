import * as Fab from '@/components/Fab'
import {useStores} from '@/models'
import {ChecklistItem} from '@/models/ChecklistItem'
import {useNavigate} from '@/navigators'
import {Trans, useLingui} from '@lingui/react/macro'
import {Input, ListItem} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {TouchableOpacity, ViewStyle} from 'react-native'
import {Avatar} from '../Avatar'
import BottomSheetModal, {BottomSheetModalType} from '../BottomSheetModal'
import {Title} from '../Layout/Content'
import {TransText} from '../TransText'

export const ChecklistItemBottomSheet: FC = observer(({}) => {
  const {checklistStore} = useStores()
  const item = checklistStore.activeItem as ChecklistItem
  const ref = useRef<BottomSheetModalType>(null)
  const {t} = useLingui()
  const {navigateWithChecklist} = useNavigate()
  const [pathToOpen, setPathToOpen] = useState<string | undefined>(undefined)

  const handleCompletePress = useCallback(() => {
    if (!item.isCompleted && item.type === 'passport')
      setPathToOpen('ConfirmPassport')
    else item?.complete()
    ref.current?.close()
  }, [ref, item])

  const handleClose = useCallback(() => {
    console.log(`handleClose`)
    ref.current?.close()
  }, [ref])

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log(`handleSheetChanges index=${index}`)
      if (index < 0) {
        if (pathToOpen)
          navigateWithChecklist('ConfirmPassport', {checklistItemId: item.id})
        checklistStore.removeActiveItem()
      } else {
        setPathToOpen(undefined)
      }
    },
    [item, pathToOpen, checklistStore, navigateWithChecklist],
  )

  useEffect(() => {
    if (checklistStore.isActive) {
      ref.current?.expand()
    }
  }, [ref, checklistStore.isActive])

  const handleInputPress = useCallback(() => {
    console.log(`handleInputPress navigateWithChecklist to [ChecklistItemNote]`)
    navigateWithChecklist('ChecklistItemNote', {
      checklistItemId: item?.id,
    })
  }, [navigateWithChecklist, item?.id])

  return (
    <BottomSheetModal ref={ref} onChange={handleSheetChanges}>
      <Title>
        <ListItem containerStyle={$listItemContainerStyle}>
          <Avatar iconId={item?.iconId} size="xlarge" />
          <ListItem.Content>
            {true && (
              <ListItem.Subtitle>
                <Trans>{item?.categoryTitle}</Trans>
              </ListItem.Subtitle>
            )}
            <ListItem.Title>
              <TransText h2>{item?.title}</TransText>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Title>
      <TouchableOpacity onPress={handleInputPress}>
        <Input
          placeholder={t`메모를 남겨보세요`}
          value={item?.note}
          rightIcon={{
            name: 'edit',
          }}
        />
      </TouchableOpacity>
      <Fab.Container fixed={false}>
        <Fab.Button onPress={handleCompletePress} title={'완료로 표시하기'} />
        <Fab.Button color={'secondary'} onPress={handleClose} title={'닫기'} />
      </Fab.Container>
    </BottomSheetModal>
  )
})

const $listItemContainerStyle: ViewStyle = {
  height: 60,
}

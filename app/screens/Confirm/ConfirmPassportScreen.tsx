import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {AppStackScreenProps, goBack} from '@/navigators'
import {useChecklistItem} from '@/utils/useChecklistItem'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'

interface ConfirmPassportScreenProps
  extends AppStackScreenProps<'ConfirmPassport'> {}

export const ConfirmPassportScreen: FC<AppStackScreenProps<'ConfirmPassport'>> =
  observer(({route}) => {
    const {checklistStore} = useStores()

    const item = useChecklistItem(route)
    const handleConfirmPress = useCallback(() => {
      item?.complete()
      goBack()
    }, [item])

    const handleCancelPress = useCallback(() => {
      goBack()
    }, [])

    const instruction =
      '만료일이 해당 날짜 이전이라면\n여권을 재발급 받아야 해요.'

    return (
      <Screen>
        <ContentTitle
          title={
            <>
              <TransText h2>여권 만료일이</TransText>
              <TransText h2 primary>
                {checklistStore.passportExpiryRequiredAfterThisDate}
              </TransText>
              <TransText h2>이후인지 확인해주세요.</TransText>
            </>
          }
          subtitle={instruction}
        />

        <Fab.Container>
          <Fab.NextButtonBase
            title={'확인했어요'}
            onPress={handleConfirmPress}
          />
          <Fab.Button
            color={'secondary'}
            onPress={handleCancelPress}
            title={'재발급하고 올게요'}
          />
        </Fab.Container>
      </Screen>
    )
  })

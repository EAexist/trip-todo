import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {AppStackScreenProps, goBack} from '@/navigators'
import {useChecklistItem} from '@/utils/useChecklistItem'
import {FC, useCallback} from 'react'

export const ConfirmFlightScreen: FC<AppStackScreenProps<'ConfirmFlight'>> = ({
  route,
}) => {
  const item = useChecklistItem(route)
  const handleUploadPress = useCallback(() => {
    // Handle next button press
    console.log('Next button pressed')
  }, [])

  const handleSkipUploadAndConfirmPress = useCallback(() => {
    item?.complete()
    goBack()
  }, [item])

  const instruction =
    '탑승권 발급과 좌석 선택을 미리 할 수 있도록\n사전 체크인 알림을 보내드릴게요.'

  return (
    <Screen>
      <ContentTitle
        title={
          <TransText h2>
            {'인천 --> 도쿠시마 항공권\n예약 내역의'}{' '}
            <TransText h2 primary>
              화면 캡쳐
            </TransText>{' '}
            {'를 올려주세요.'}
          </TransText>
        }
        subtitle={instruction}
      />
      <Fab.Container>
        <Fab.Button onPress={handleUploadPress} title={'화면 캡쳐 올리기'} />
        <Fab.Button
          color={'secondary'}
          onPress={handleSkipUploadAndConfirmPress}
          title={'나중에 올리고 [항공권 예약] 완료 표시하기'}
        />
      </Fab.Container>
    </Screen>
  )
}

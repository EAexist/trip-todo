import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {AppStackScreenProps, goBack} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useTodo} from '@/utils/useTodo'
import {FC, useCallback} from 'react'

export const ConfirmFlightScreen: FC<AppStackScreenProps<'ConfirmFlight'>> = ({
  route,
}) => {
  const todo = useTodo(route)
  const {tripStore} = useStores()
  const handleUploadPress = useCallback(() => {
    // Handle next button press
    console.log('Next button pressed')
  }, [])

  const instruction =
    '탑승권 발급과 좌석 선택을 미리 할 수 있도록 사전 체크인 알림을 보내드릴게요.'

  const handleBackPressBeforeNavigate = useCallback(async () => {
    if (todo) {
      todo.setIncomplete()
      tripStore.patchTodo(todo)
    }
  }, [])
  useHeader({
    onBackPressBeforeNavigate: handleBackPressBeforeNavigate,
  })

  return (
    <Screen>
      <ContentTitle
        title={
          <TransText h2>
            {`${todo?.flightTitle} 항공권 `}
            <TransText h2 primary>
              예약 내역 화면을 캡쳐
            </TransText>
            {'해서 올려주세요.'}
          </TransText>
        }
        subtitle={instruction}
      />
      <Fab.Container>
        <Fab.Button onPress={handleUploadPress} title={'화면 캡쳐 올리기'} />
        <Fab.NextButton
          navigateProps={{
            name: 'Todolist',
          }}
          title={'올리지 않고 할일 완료하기'}
          //   promiseBeforeNavigate={confirmTodoBeforeNavigate}
          color={'secondary'}
        />
      </Fab.Container>
    </Screen>
  )
}

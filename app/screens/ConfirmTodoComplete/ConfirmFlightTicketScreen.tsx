import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {withTodo} from '@/utils/withTodo'
import {useCallback} from 'react'

export const ConfirmFlightTicketScreen = withTodo<'ConfirmFlightTicket'>(
  ({todo}) => {
    const {
      tripStore: {completeAndPatchTodo},
    } = useStores()
    const handleUploadPress = useCallback(() => {
      // Handle next button press
      console.log('Next button pressed')
    }, [])

    const instruction = '공항에서 간편하게 꺼내볼 수 있도록 준비해드릴게요'

    const confirmCompleteTodo = useCallback(async () => {
      completeAndPatchTodo(todo)
    }, [])

    return (
      <Screen>
        <ContentTitle
          title={
            <TransText h2>
              {todo.departure ? `${todo.flightTitleWithCode} 편\n` : ''}
              <TransText h2 primary>
                모바일 탑승권
              </TransText>
              {'을 저장해주세요.'}
            </TransText>
          }
          subtitle={instruction}
        />
        <Fab.Container>
          <Fab.Button
            onPress={handleUploadPress}
            title={'모바일 탑승권 올리기'}
          />
          <Fab.NextButton
            navigateProps={{
              name: 'Todolist',
            }}
            title={'올리지 않고 할일 완료하기'}
            color={'secondary'}
            promiseBeforeNavigate={confirmCompleteTodo}
          />
        </Fab.Container>
      </Screen>
    )
  },
)

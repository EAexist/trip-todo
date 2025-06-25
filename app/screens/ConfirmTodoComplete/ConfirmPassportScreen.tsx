import * as Fab from '@/components/Fab'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {Todo} from '@/models/Todo'
import {AppStackScreenProps} from '@/navigators'
import {useTodo} from '@/utils/useTodo'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'

interface ConfirmPassportScreenProps
  extends AppStackScreenProps<'ConfirmPassport'> {}

export const ConfirmPassportScreen: FC<ConfirmPassportScreenProps> = observer(
  ({route}) => {
    const {tripStore} = useStores()

    const todo = useTodo(route)
    const cancelConfirmBeforeNavigate = useCallback(async () => {
      todo?.setIncomplete()
      await tripStore.patchTodo(todo as Todo)
    }, [todo])

    const instruction =
      '만료일이 해당 날짜 이전이라면\n여권을 재발급 받아야 해요.'

    return (
      <Screen>
        <ContentTitle
          title={
            <>
              <TransText h2>여권 만료일이</TransText>
              <TransText h2 primary>
                {tripStore.passportExpiryRequiredAfterThisDate}
              </TransText>
              <TransText h2>이후인지 확인해주세요.</TransText>
            </>
          }
          subtitle={instruction}
        />

        <Fab.Container>
          <Fab.GoBackButton
            title={'확인했어요'}
            // promiseBeforeNavigate={confirmTodoBeforeNavigate}
          />
          <Fab.GoBackButton
            color={'secondary'}
            title={'재발급하고 올게요'}
            promiseBeforeNavigate={cancelConfirmBeforeNavigate}
          />
        </Fab.Container>
      </Screen>
    )
  },
)

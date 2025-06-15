import {useStores} from '@/models'
import {useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {TodolistAddScreenBase} from './TodolistAddScreenBase'

interface TodolistAddScreenProps {}

export const TodolistAddScreen = observer((props: TodolistAddScreenProps) => {
  const {tripStore} = useStores()
  const {navigateWithTrip} = useNavigate()
  const handleToDeleteScreenPress = useCallback(() => {
    navigateWithTrip('TodolistDelete')
  }, [])

  useHeader({rightActionTitle: '삭제', onRightPress: handleToDeleteScreenPress})
  return (
    <TodolistAddScreenBase
      title={'새 할 일 추가하기'}
      instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
      nextButtonProps={{
        name: 'Todolist',
        params: {tripId: tripStore.id},
        buttonProps: {title: '확인'},
      }}
    />
  )
})

// export default withTheme<TodolistAddScreenProps>(TodolistAddScreen, 'TodolistAddScreen')

import {AppStackScreenProps, useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {TodolistAddScreenBase} from './TodolistAddScreenBase'

interface TodolistAddScreenProps extends AppStackScreenProps<'TodolistAdd'> {}

export const TodolistAddScreen: FC<TodolistAddScreenProps> = observer(
  ({route}) => {
    const {navigateWithTrip} = useNavigate()
    const handleToDeleteScreenPress = useCallback(() => {
      navigateWithTrip('TodolistDelete')
    }, [])

    useHeader({
      rightActionTitle: '삭제',
      onRightPress: handleToDeleteScreenPress,
    })
    return (
      <TodolistAddScreenBase
        title={'새 할 일 추가하기'}
        instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
        tripId={route.params.tripId}
        nextButtonProps={{
          title: '확인',
          navigateProps: {
            name: 'Todolist',
          },
        }}
      />
    )
  },
)

// export default withTheme<TodolistAddScreenProps>(TodolistAddScreen, 'TodolistAddScreen')

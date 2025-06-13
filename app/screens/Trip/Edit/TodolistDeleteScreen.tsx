import {DeleteTodo} from '@/components/Todo'
import {useStores} from '@/models'
import {goBack} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useCallback, useEffect} from 'react'
import CheckListEditScreenBase from './TodolistEditScreenBase'
import {observer} from 'mobx-react-lite'

interface TodolistDeleteScreenProps {}

export const TodolistDeleteScreen = observer(
  (props: TodolistDeleteScreenProps) => {
    const {tripStore} = useStores()

    const handleCompletePress = useCallback(() => {
      tripStore.deleteTodos()
      goBack()
    }, [tripStore])

    useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
    return (
      <CheckListEditScreenBase
        title={'할 일 삭제하기'}
        instruction={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
        sections={tripStore.deleteFlaggedTrip}
        Todo={DeleteTodo}
      />
    )
  },
)

import {DeleteTodo} from '@/components/Todo'
import {useStores} from '@/models'
import {goBack} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useCallback, useEffect} from 'react'
import CheckListEditScreenBase from './TodolistEditScreenBase'
import {Observer, observer} from 'mobx-react-lite'
import {DefaultSectionT, SectionListRenderItem} from 'react-native'
import {Todo} from '@/models/Todo'

interface TodolistDeleteScreenProps {}

export const TodolistDeleteScreen = observer(
  (props: TodolistDeleteScreenProps) => {
    const {tripStore} = useStores()

    const handleCompletePress = useCallback(() => {
      tripStore.deleteTodos().then(() => {
        goBack()
      })
    }, [tripStore])

    const renderItem: SectionListRenderItem<Todo, DefaultSectionT> = ({
      item,
    }) => <Observer render={() => <DeleteTodo todo={item} key={item?.id} />} />

    useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
    return (
      <CheckListEditScreenBase
        title={'할 일 삭제하기'}
        instruction={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
        sections={tripStore.deleteFlaggedTrip}
        renderItem={renderItem}
        // Todo={DeleteTodo}
      />
    )
  },
)

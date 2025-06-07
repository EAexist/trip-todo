import {DeleteChecklistItem} from '@/components/ChecklistItem'
import {useStores} from '@/models'
import {goBack} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {useCallback, useEffect} from 'react'
import CheckListEditScreenBase from './ChecklistEditScreenBase'
import {observer} from 'mobx-react-lite'

interface ChecklistDeleteScreenProps {}

export const ChecklistDeleteScreen = observer(
  (props: ChecklistDeleteScreenProps) => {
    const {checklistStore} = useStores()

    const handleCompletePress = useCallback(() => {
      checklistStore.deleteItems()
      goBack()
    }, [checklistStore])

    useHeader({rightActionTitle: '완료', onRightPress: handleCompletePress})
    return (
      <CheckListEditScreenBase
        title={'할 일 삭제하기'}
        instruction={'관리하지 않아도 되늗 할 일을 지울 수 있어요'}
        sections={checklistStore.deleteFlaggedChecklist}
        ChecklistItem={DeleteChecklistItem}
      />
    )
  },
)

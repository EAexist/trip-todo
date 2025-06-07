import {useStores} from '@/models'
import {observer} from 'mobx-react-lite'
import {ChecklistAddScreenBase} from '../Checklist/Edit/ChecklistAddScreenBase'

export const ChecklistSettingScreen = observer(() => {
  const {checklistStore} = useStores()

  return (
    <ChecklistAddScreenBase
      title={'새 할 일 추가하기'}
      instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
      nextButtonProps={{
        name: 'Checklist',
        params: {checklistId: checklistStore.id},
        buttonProps: {title: '확인'},
      }}
    />
  )
})

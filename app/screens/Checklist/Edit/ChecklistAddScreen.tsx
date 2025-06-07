import {useStores} from '@/models'
import {useNavigate} from '@/navigators'
import {useHeader} from '@/utils/useHeader'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {ChecklistAddScreenBase} from './ChecklistAddScreenBase'

interface ChecklistAddScreenProps {}

export const ChecklistAddScreen = observer((props: ChecklistAddScreenProps) => {
  const {checklistStore} = useStores()
  const {navigateWithChecklist} = useNavigate()
  const handleToDeleteScreenPress = useCallback(() => {
    navigateWithChecklist('ChecklistDelete')
  }, [])

  useHeader({rightActionTitle: '삭제', onRightPress: handleToDeleteScreenPress})
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

// export default withTheme<ChecklistAddScreenProps>(ChecklistAddScreen, 'ChecklistAddScreen')

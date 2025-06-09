import {useStores} from '@/models'
import {observer} from 'mobx-react-lite'
import {TodolistAddScreenBase} from '../Trip/Edit/TodolistAddScreenBase'

export const TripSettingScreen = observer(() => {
  const {tripStore} = useStores()

  return (
    <TodolistAddScreenBase
      title={'새 할 일 추가하기'}
      instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
      nextButtonProps={{
        name: 'Trip',
        params: {tripId: tripStore.id},
        buttonProps: {title: '확인'},
      }}
    />
  )
})

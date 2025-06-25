import {AppStackScreenProps} from '@/navigators'
import {observer} from 'mobx-react-lite'
import {FC} from 'react'
import {TodolistAddScreenBase} from '../Todolist/Edit/TodolistAddScreenBase'

export const TodolistSettingScreen: FC<AppStackScreenProps<'TodolistSetting'>> =
  observer(({route}) => {
    return (
      <TodolistAddScreenBase
        title={'새 할 일 추가하기'}
        instruction={'체크리스트에서 관리할 할 일을 추가해보세요'}
        tripId={route.params.tripId}
        nextButtonProps={{
          navigateProps: {name: 'Todolist'},
          title: '확인',
        }}
      />
    )
  })

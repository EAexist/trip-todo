import {AppStackScreenProps} from '@/navigators'
import {useTodo} from '@/utils/useTodo'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {TripTitleSettingScreenBase} from '../New/TitleSettingScreenBase'

export const TodoTitleScreen: FC<
  AppStackScreenProps<'TodoTitle'>
> = observer(({route}) => {
  const item = useTodo(route)
  const handleNextPress = useCallback(
    async (value: string) => {
      item.setProp('title', value)
    },
    [item],
  )

  return (
    <TripTitleSettingScreenBase
      inputProps={{
        label: `할 일 이름`,
        placeholder: `할 일 이름 입력하기`,
      }}
      title={`어떤 할 일을 추가할까요?`}
      name="TodoNote"
      params={{todoId: item.id}}
      onConfirm={handleNextPress}
    />
  )
})

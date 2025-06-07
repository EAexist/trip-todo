import {AppStackScreenProps} from '@/navigators'
import {useChecklistItem} from '@/utils/useChecklistItem'
import {observer} from 'mobx-react-lite'
import {FC, useCallback} from 'react'
import {ChecklistTitleSettingScreenBase} from '../New/TitleSettingScreenBase'

export const ChecklistItemTitleScreen: FC<
  AppStackScreenProps<'ChecklistItemTitle'>
> = observer(({route}) => {
  const item = useChecklistItem(route)
  const handleNextPress = useCallback(
    async (value: string) => {
      item.setProp('title', value)
    },
    [item],
  )

  return (
    <ChecklistTitleSettingScreenBase
      inputProps={{
        label: `할 일 이름`,
        placeholder: `할 일 이름 입력하기`,
      }}
      title={`어떤 할 일을 추가할까요?`}
      name="ChecklistItemNote"
      params={{checklistItemId: item.id}}
      onConfirm={handleNextPress}
    />
  )
})

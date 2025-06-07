import {useStores} from '@/models'
import {useLingui} from '@lingui/react/macro'
import {FC, useCallback} from 'react'
import {ChecklistTitleSettingScreenBase} from './TitleSettingScreenBase'

export const ChecklistTitleSettingScreen: FC = () => {
  const {checklistStore} = useStores()
  const {t} = useLingui()

  const handleNextPress = useCallback(
    async (value: string) => {
      checklistStore.setProp('title', value)
    },
    [checklistStore],
  )

  return (
    <ChecklistTitleSettingScreenBase
      inputProps={{
        label: `여행 이름`,
        placeholder: `여행 이름`,
      }}
      title={`여행의 이름을 정해주세요`}
      name="ChecklistSetting"
      onConfirm={handleNextPress}
    />
  )
}

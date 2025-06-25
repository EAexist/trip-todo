import {useStores} from '@/models'
import {useLingui} from '@lingui/react/macro'
import {FC, useCallback} from 'react'
import {TripTitleSettingScreenBase} from './TitleSettingScreenBase'

export const TripTitleSettingScreen: FC = () => {
  const {tripStore} = useStores()
  const {t} = useLingui()

  const handleNextPress = useCallback(
    async (value: string) => {
      tripStore.setProp('title', value)
      tripStore.patch()
    },
    [tripStore],
  )

  return (
    <TripTitleSettingScreenBase
      inputProps={{
        label: `여행 이름`,
        placeholder: `여행 이름`,
      }}
      title={`여행의 이름을 정해주세요`}
      onConfirm={handleNextPress}
      nextButtonProps={{
        navigateProps: {
          name: 'TodolistSetting',
        },
      }}
    />
  )
}

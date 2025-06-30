import * as Fab from '@/components/Fab'
import {Input} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {InputProps} from '@rneui/base'
import {FC, useCallback, useState} from 'react'
import {Text, View} from 'react-native'

export const TripTitleSettingScreenBase: FC<{
  title: string
  instruction?: string
  inputProps?: Partial<InputProps>
  onConfirm: (value: string) => Promise<any>
  nextButtonProps: Fab.NextButtonProps
}> = ({title, inputProps, onConfirm, nextButtonProps}) => {
  const [value, setValue] = useState('')
  const promiseBeforeNavigate = useCallback(async () => {
    onConfirm(value)
  }, [value, onConfirm])
  return (
    <Screen>
      <ContentTitle title={title} />
      <View>
        <Input value={value} setValue={setValue} {...inputProps} />
      </View>
      <Fab.Container>
        <Fab.NextButton
          promiseBeforeNavigate={promiseBeforeNavigate}
          {...nextButtonProps}
        />
      </Fab.Container>
    </Screen>
  )
}

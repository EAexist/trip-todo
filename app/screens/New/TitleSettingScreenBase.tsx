import * as Fab from '@/components/Fab'
import {Input} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {InputProps} from '@rneui/base'
import {FC, useCallback, useState} from 'react'
import {View} from 'react-native'

export const ChecklistTitleSettingScreenBase: FC<
  {
    title: string
    instruction?: string
    inputProps?: Partial<InputProps>
    onConfirm: (value: string) => Promise<any>
  } & Omit<Fab.NextButtonBaseProps, 'Fab.NextButtonBaseProps'>
> = ({title, inputProps, onConfirm, ...props}) => {
  const [value, setValue] = useState('')
  const handlePressbeforeNavigate = useCallback(async () => {
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
          handlePressbeforeNavigate={handlePressbeforeNavigate}
          {...props}
        />
      </Fab.Container>
    </Screen>
  )
}

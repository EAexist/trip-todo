import {ControlledInput} from '@/components/Input'
import ListSubheader from '@/components/ListSubheader'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {View} from 'react-native'
import * as Fab from '@/components/Fab'

interface NoteProps {
  initialValue?: string
  onChangeNote?: (note: string) => void
  isFocused?: boolean
  setIsFocused?: Dispatch<SetStateAction<boolean>>
}

export const Note = ({
  onChangeNote,
  initialValue,
  isFocused,
  setIsFocused,
}: NoteProps) => {
  const [value, setValue] = useState(initialValue)
  const [_isFocused, _setIsFocused] = useState(false)

  useEffect(() => {
    if (setIsFocused && !isFocused && onChangeNote && value) {
      onChangeNote(value)
    }
  }, [isFocused, value])

  useEffect(() => {
    if (!setIsFocused && !_isFocused && onChangeNote && value) {
      onChangeNote(value)
    }
  }, [_isFocused, value])

  return (
    <View
      style={{
        flexShrink: 1,
      }}>
      <ListSubheader title={'메모'} />
      <ControlledInput
        setValue={setValue}
        value={value}
        autoFocus={!initialValue}
        onBlur={() => {
          if (setIsFocused) {
            setIsFocused(false)
          } else {
            _setIsFocused(false)
          }
        }}
        onFocus={() => {
          if (setIsFocused) {
            setIsFocused(true)
          } else {
            _setIsFocused(true)
          }
        }}
        multiline
        numberOfLines={24}
        containerStyle={{flexShrink: 1}}
        inputContainerStyle={{
          flexShrink: 1,
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      />
    </View>
  )
}

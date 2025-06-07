import {ButtonProps, Icon, useTheme} from '@rneui/themed'
import {FC, useCallback} from 'react'
import {StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native'
import {Button} from '../Button'
import {goBack} from '@/navigators'

export const BackButton: FC<TouchableOpacityProps> = () => {
  const handlePress = useCallback(() => {
    goBack()
  }, [])

  return (
    <TouchableOpacity style={styles.BackButton} onPress={handlePress}>
      <Icon
        name="arrow-back-ios"
        type="material"
        color="rgba(0, 0, 0, 0.56)"
        size={24}
      />
    </TouchableOpacity>
  )
}
export const RightActionButton: FC<ButtonProps> = props => {
  const {theme} = useTheme()
  return (
    <Button
      {...props}
      buttonStyle={{
        backgroundColor: theme.colors.transparent,
        ...styles.RightActionButton,
      }}
      titleStyle={{
        color: theme.colors.text.primary,
      }}
    />
  )
}

const styles = StyleSheet.create({
  BackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // borderRadius: 100,
  },
  // CompleteButtonText: {
  //   fontSize: 15,
  //   letterSpacing: 0.46,
  //   lineHeight: 26,
  //   textAlign: 'left',
  // },
  RightActionButton: {
    paddingHorizontal: 12,
  },
})

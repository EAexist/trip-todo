import {withTheme} from '@rneui/themed'
import {TextStyle, View, ViewStyle} from 'react-native'
import {TransText} from './TransText'
import {PropsWithChildren} from 'react'

export interface SectionHeaderProps extends PropsWithChildren {
  // title: string
  // size?: 'sm' | 'md' | 'lg'
  lg?: boolean
  style?: ViewStyle
  titleStyle?: TextStyle
}

const SectionHeader = ({children, style, titleStyle}: SectionHeaderProps) => {
  //   const { theme, updateTheme, replaceTheme } = props

  return (
    <View style={style}>
      <TransText h3 h3Style={titleStyle}>
        {children}
      </TransText>
    </View>
  )
}

// declare module '@rneui/themed' {
//   export interface ComponentTheme {
//     SectionHeader: Partial<SectionHeaderProps>
//   }
// }
export default withTheme<SectionHeaderProps>(SectionHeader, 'SectionHeader')

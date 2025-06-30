import '@rneui/themed'
import {ListSubheaderProps} from '@/components/ListSubheader'
import {SectionHeaderProps} from '@/components/SectionHeader'

declare module '@rneui/themed' {
  export interface Colors {
    text: {
      primary: string
      secondary: string
    }
    contrastText: {
      primary: string
      secondary: string
    }
    transparent: string
    light0: string
    light1: string
    active: string
    inactive: string
  }
  export interface ListItemProps {
    useDisabledStyle?: boolean
  }
  export interface IconProps {
    primary?: boolean
  }
  export interface TextProps {
    primary?: boolean
  }
  export interface InputProps {
    primary?: boolean
  }
  // export interface AvatarProps {
  //   size?: ('small' | 'medium' | 'large' | 'xlarge' | '2xlarge') | number
  // }
  export interface ListItemTitleProps extends Partial<TextProps> {
    primary?: boolean
  }
  export interface ComponentTheme {
    ListSubheader: Partial<ListSubheaderProps>
    SectionHeader: Partial<SectionHeaderProps>
    ListItem: Partial<ListItemProps>
    Text: Partial<TextProps>
    Input: Partial<InputProps>
    Icon: Partial<IconProps>
    ListItemTitle: Partial<TextProps>
  }
  // export interface ListItem {
  //   Caption: Component
  // }
}

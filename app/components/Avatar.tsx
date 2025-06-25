import {Avatar as RNEAvatar, AvatarProps as RNEAvatarProps} from '@rneui/themed'
import {PropsWithChildren} from 'react'
import {StyleSheet} from 'react-native'

export type AvatarIconType = 'tossface' | 'icon'
export interface AvatarProps extends RNEAvatarProps {
  iconId?: string
  type?: AvatarIconType
}

export const Avatar = ({
  type = 'tossface',
  iconId,
  children,
  icon,
  ...props
}: PropsWithChildren<AvatarProps>) => {
  //   const { theme, updateTheme, replaceTheme } = props

  return (
    <RNEAvatar
      {...(type === 'tossface' && !icon
        ? {title: iconId, titleStyle: styles.titleStyle}
        : {icon})}
      //   {...{title: iconId, titleStyle: styles.titleStyle}}
      {...props}
      // icon={props.icon}
    >
      {children}
    </RNEAvatar>
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'tossface',
  },
})

// export default withTheme<AvatarProps>(Avatar, 'Avatar')

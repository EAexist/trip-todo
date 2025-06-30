import {
  Avatar as RNEAvatar,
  AvatarProps as RNEAvatarProps,
  Text,
} from '@rneui/themed'
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
  return (
    <RNEAvatar
      {...(type === 'tossface' && !icon
        ? {renderCustomContent: <Text style={styles.titleStyle}>{iconId}</Text>}
        : {icon})}
      {...props}>
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

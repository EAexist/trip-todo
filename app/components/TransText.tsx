import {Trans} from '@lingui/react/macro'
import {Text as RNEText, TextProps} from '@rneui/themed'
import {FC} from 'react'

export const TransText: FC<TextProps> = ({children, ...props}) => {
  return (
    <RNEText {...props}>
      <Trans>{children}</Trans>
    </RNEText>
  )
}

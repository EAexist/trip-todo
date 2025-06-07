import {useLingui} from '@lingui/react/macro'
import {ButtonProps, Button as RNEButton} from '@rneui/themed'
import {FC} from 'react'

export const Button: FC<ButtonProps> = ({title, ...props}) => {
  const {t} = useLingui()

  return <RNEButton {...props} title={t`${title}`} />
}

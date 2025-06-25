import {AvatarProps} from '@rneui/base'
import {ListItem, ListItemProps} from '@rneui/themed'
import {FC, ReactNode} from 'react'
import {Avatar} from './Avatar'
import {Trans} from '@lingui/react/macro'

export interface ListItemBaseProps extends ListItemProps {
  title: string
  subtitle?: string
  avatarProps?: AvatarProps
  rightContent?: ReactNode
}

export const ListItemBase: FC<ListItemBaseProps> = ({
  title,
  subtitle,
  avatarProps,
  rightContent,
  ...props
}) => {
  return (
    <ListItem {...props}>
      <Avatar {...avatarProps} />
      <ListItem.Content>
        <ListItem.Title>
          <Trans>{title}</Trans>
        </ListItem.Title>
        <ListItem.Subtitle>
          <Trans>{subtitle}</Trans>
        </ListItem.Subtitle>
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

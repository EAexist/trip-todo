import {Trans} from '@lingui/react/macro'
import {ListItem, ListItemProps, useTheme} from '@rneui/themed'
import {FC, PropsWithChildren, ReactNode} from 'react'
import {TextStyle, ViewStyle} from 'react-native'
import {ListItemCaption} from './ListItemCaption'
import {TransText} from './TransText'

interface TextInfoListItemProps extends ListItemProps {
  title: string
  subtitle?: string
  caption?: string
  rightContent?: ReactNode
  // contentStyle?: StyleProp<ViewStyle>
  // children: ReactNode
}

export const TextInfoListItem: FC<PropsWithChildren<TextInfoListItemProps>> = ({
  title,
  subtitle,
  caption,
  children,
  rightContent,
  ...props
}) => {
  const {theme} = useTheme()

  return (
    <ListItem {...props} containerStyle={$cotainerStyle}>
      <ListItem.Content style={{...$titleContainerstyle}}>
        <ListItem.Title
          style={{color: theme.colors.contrastText.secondary}}
          // style={
          //   subtitle
          //     ? listItemStyles.TitleWithSubtitle
          //     : listItemStyles.TitleOnly
          // }
        >
          <Trans>{title}</Trans>
          {caption && <ListItemCaption>{caption}</ListItemCaption>}
        </ListItem.Title>
        {subtitle && (
          <ListItem.Subtitle>
            <Trans>{subtitle}</Trans>
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      <ListItem.Content style={$contentstyle}>
        {typeof children === 'string' ? (
          <TransText style={$contentTextStyle}>{children}</TransText>
        ) : (
          children
        )}
      </ListItem.Content>
      {rightContent}
    </ListItem>
  )
}

const $cotainerStyle: ViewStyle = {
  paddingHorizontal: 24,
}

const $contentstyle: ViewStyle = {
  flexGrow: 1,
  alignItems: 'flex-end',
}

const $titleContainerstyle: ViewStyle = {
  width: '25%',
  flexShrink: 0,
  flexGrow: 0,
  flexBasis: 'auto',
}
const $contentTextStyle: TextStyle = {
  textAlign: 'right',
}

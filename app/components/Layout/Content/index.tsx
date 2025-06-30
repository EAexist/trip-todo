import {TransText} from '@/components/TransText'
import {Text, useTheme} from '@rneui/themed'
import {FC, PropsWithChildren, ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'

interface TitleProps {
  children: ReactNode
}

export const Title: FC<TitleProps> = ({children}) => (
  <View style={styles.TitleContainer}>{children}</View>
)

interface TitleTextProps extends PropsWithChildren {}

export const TitleText: FC<TitleTextProps> = ({children}) => (
  <View style={styles.TitleTextContainer}>
    {typeof children === 'string' ? (
      <TransText h2>{children}</TransText>
    ) : (
      children
    )}
  </View>
)

interface SubtitleTextProps extends PropsWithChildren {}

export const SubtitleText: FC<SubtitleTextProps> = ({children}) => {
  const {theme} = useTheme()
  return (
    <View style={styles.SubtitleTextContainer}>
      <TransText style={{color: theme.colors.text.secondary}}>
        {children}
      </TransText>
    </View>
  )
}

export interface ContentTitleProps {
  title?: ReactNode
  subtitle?: ReactNode
}

export default function ContentTitle({title, subtitle}: ContentTitleProps) {
  return (
    <Title>
      <TitleText>{title}</TitleText>
      {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
    </Title>
  )
}

const styles = StyleSheet.create({
  SubtitleTextContainer: {
    paddingHorizontal: 24,
  },
  TitleContainer: {
    paddingVertical: 20,
  },
  TitleTextContainer: {
    paddingHorizontal: 24,
  },
})

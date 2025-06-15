import {useEffect, useLayoutEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {Platform} from 'react-native'
import {Header} from '@rneui/themed'
import {BackButton, RightActionButton} from '@/components/Header'

interface HeaderProps {
  headerShown?: boolean
  hideBackButton?: boolean
  rightActionTitle?: string
  onRightPress?: () => void
  onBackPressBeforeNavigate?: () => Promise<any>
}

/**
 * A hook that can be used to easily set the Header of a react-navigation screen from within the screen's component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/utility/useHeader/}
 * @param {HeaderProps} headerProps - The props for the `Header` component.
 * @param {any[]} deps - The dependencies to watch for changes to update the header.
 */
export function useHeader(
  {
    headerShown = true,
    hideBackButton = false,
    rightActionTitle,
    onRightPress,
    onBackPressBeforeNavigate,
  }: HeaderProps,
  deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
  const navigation = useNavigation()

  /**
   * We need to have multiple implementations of this hook for web and mobile.
   * Web needs to use useEffect to avoid a rendering loop.
   * In mobile and also to avoid a visible header jump when navigating between screens, we use
   * `useLayoutEffect`, which will apply the settings before the screen renders.
   */
  const usePlatformEffect = Platform.OS === 'web' ? useEffect : useLayoutEffect

  // To avoid a visible header jump when navigating between screens, we use
  // `useLayoutEffect`, which will apply the settings before the screen renders.
  usePlatformEffect(() => {
    navigation.setOptions({
      headerShown,
      header: () => (
        <Header
          leftComponent={
            hideBackButton ? undefined : (
              <BackButton
                onBackPressBeforeNavigate={onBackPressBeforeNavigate}
              />
            )
          }
          rightComponent={
            <RightActionButton
              onPress={onRightPress}
              title={rightActionTitle}
            />
          }
        />
      ),
    })
    // intentionally created API to have user set when they want to update the header via `deps`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, navigation])
}

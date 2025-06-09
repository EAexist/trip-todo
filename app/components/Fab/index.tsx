import {AppStackParamList, navigate, useNavigate} from '@/navigators'
import {ButtonProps} from '@rneui/themed'
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {LayoutChangeEvent, View, ViewStyle} from 'react-native'
import {Button as ButtonBase} from '../Button'

interface FabHeightContextType {
  height: number
  setHeight: Dispatch<SetStateAction<number>>
}

const FabHeightContext = createContext<FabHeightContextType>({})
export const FabProvider = ({children}: PropsWithChildren) => {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    console.log(`[FabHeightContext] height=${height}`)
  }, [height])
  return (
    <FabHeightContext.Provider value={{height, setHeight}}>
      {children}
    </FabHeightContext.Provider>
  )
}
export const useFabHeight = () => useContext(FabHeightContext)

/**
 * Fab.Container
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const Container: FC<PropsWithChildren<{fixed?: boolean}>> = ({
  fixed = true,
  children,
}) => {
  const {setHeight} = useFabHeight()
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setHeight(event.nativeEvent.layout.height)
    },
    [setHeight],
  )
  useEffect(() => {
    return () => {
      setHeight(0)
    }
  }, [setHeight])
  return (
    <View
      onLayout={fixed ? handleLayout : undefined}
      style={$containerStyle(fixed)}>
      {children}
    </View>
  )
}

/**
 * Fab.Button
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const Button: FC<ButtonProps> = props => (
  <ButtonBase
    // buttonStyle={styles.Button}
    // titleStyle={styles.ButtonTitleStyle}
    {...props}
  />
)
type NavigateProps = {
  name: keyof AppStackParamList
  params?: unknown
}
/**
 * Fab.NextButtonBase
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const NextButtonBase: FC<ButtonProps> = props => {
  return <Button uppercase title={props.title || '다음'} {...props} />
}

export interface NextButtonBaseProps extends NavigateProps {
  buttonProps?: ButtonProps
  handlePressbeforeNavigate?: () => Promise<any>
  doNavigateWithTrip?: boolean
}

/**
 * Fab.NextButton
 * @param {ButtonProps}
 * @returns {ReactElement}
 */
export const NextButton: FC<NextButtonBaseProps> = ({
  name,
  params,
  buttonProps,
  handlePressbeforeNavigate,
  doNavigateWithTrip = true,
}) => {
  const {navigateWithTrip} = useNavigate()

  const _navigate = doNavigateWithTrip ? navigateWithTrip : navigate

  const handlePress = useCallback(() => {
    if (handlePressbeforeNavigate)
      handlePressbeforeNavigate().then(() => {
        _navigate(name, params)
      })
    else _navigate(name, params)
  }, [_navigate, handlePressbeforeNavigate, name, params])

  return (
    <NextButtonBase
      title={buttonProps?.title || '다음'}
      onPress={handlePress}
      {...buttonProps}
    />
  )
}

const $containerStyle: (fixed: boolean) => ViewStyle = fixed => ({
  // backgroundColor: 'blue',
  gap: 0.75 * 16,
  paddingBottom: 2 * 16,
  paddingHorizontal: 1.25 * 16,
  paddingVertical: 1.25 * 16,
  ...(fixed
    ? {
        bottom: 0,
        position: 'absolute',
        width: '100%',
      }
    : {
        // position: 'absolute',
        // width: '100%'
      }),
})

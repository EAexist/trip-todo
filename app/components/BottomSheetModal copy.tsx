import {useNavigate} from '@/navigators'
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
} from '@gorhom/bottom-sheet'
import {useFocusEffect} from '@react-navigation/native'
import {
  PropsWithChildren,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {StyleSheet} from 'react-native'
import {GestureHandlerRootView as RNGestureHandlerRootView} from 'react-native-gesture-handler'
import {GestureHandlerRootViewProps} from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView'

export const GestureHandlerRootViewWrapper = (
  props: GestureHandlerRootViewProps,
) => (
  <RNGestureHandlerRootView style={styles.gestureHandlerRootView} {...props} />
)

export const useNavigationBottomSheet = (
  ref: RefObject<BottomSheetModal | null>,
  promiseBeforeNavigate?: () => Promise<any>,
) => {
  //   const ref = useRef<BottomSheetMethods>(null)
  const [activeCandidateKey, setActiveCandidateKey] = useState<
    string | undefined
  >(undefined)
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    setActiveKey(undefined)
  }, [])

  const handleBottomSheetModalChange = useCallback(
    (index: number) => {
      console.log(`[onChange] ${index} ${activeCandidateKey}`)
      if (index < 0 && activeCandidateKey) {
        console.log(`[onChange] setActiveKey`)
        setActiveKey(activeCandidateKey)
      } else {
        setActiveCandidateKey(undefined)
      }
    },
    [activeCandidateKey, setActiveCandidateKey],
  )
  const activate = useCallback((path: string) => {
    ref?.current?.forceClose()
    setActiveCandidateKey(path)
  }, [])

  const useActiveKey = (callback: (activeKey: string) => void) =>
    useFocusEffect(
      useCallback(() => {
        console.log(`activeKey=${activeKey}`)
        if (activeKey) {
          const temp = activeKey
          setActiveKey(undefined)
          callback(temp)
        }
      }, [activeKey]),
    )

  return {
    useActiveKey,
    activate,
    handleBottomSheetModalChange,
  }
}

const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
  <GorhomBottomSheetBackdrop
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    {...props}
  />
)

// export type BottomSheetModalType = GorhomBottomSheetModal

export const BottomSheetModal = ({
  children,
  ref,
  ...props
}: PropsWithChildren<BottomSheetModalProps & {ref: Ref<BottomSheet>}>) => {
  return (
    <BottomSheet
      ref={ref}
      style={styles.sheetContainer}
      backgroundStyle={styles.sheetBackground}
      backdropComponent={BottomSheetBackdrop}
      detached={true}
      bottomInset={12}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      index={-1}
      {...props}
      // snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  )
}

BottomSheetModal.displayName = 'BottomSheetModal'

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 24,
    // flex: 1,
  },
  gestureHandlerRootView: {
    flex: 1,
  },
  sheetBackground: {
    borderRadius: 24,
  },
  sheetContainer: {
    // flex: 1,
    marginHorizontal: 10,
  },
})

export default BottomSheetModal

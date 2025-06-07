import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet'
import {forwardRef, PropsWithChildren} from 'react'
import {StyleSheet} from 'react-native'
import {GestureHandlerRootView as RNGestureHandlerRootView} from 'react-native-gesture-handler'
import {GestureHandlerRootViewProps} from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView'

export const GestureHandlerRootViewWrapper = (
  props: GestureHandlerRootViewProps,
) => (
  <RNGestureHandlerRootView style={styles.gestureHandlerRootView} {...props} />
)

const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => (
  <GorhomBottomSheetBackdrop
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    {...props}
  />
)

export type BottomSheetModalType = GorhomBottomSheetModal

export const BottomSheetModal = forwardRef<
  BottomSheet,
  PropsWithChildren<BottomSheetModalProps>
>(({children, ...props}, ref) => {
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
})

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

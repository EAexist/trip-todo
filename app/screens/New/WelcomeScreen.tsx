import {FC, useEffect} from 'react'
//
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {AppStackScreenProps, useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import {observer} from 'mobx-react-lite'
import {View} from 'react-native'

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const rootStore = useStores()
    const {userStore} = rootStore
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      if (rootStore.userStore.trip.length > 0) {
        rootStore.fetchTrip(rootStore.userStore.currentTrip).then(() => {
          if (rootStore.tripStore.isInitialized) {
            navigateWithTrip('Main', {screen: 'Todolist'})
          } else {
            navigateWithTrip('DestinationSetting')
          }
        })
      } else {
        rootStore.createTrip().then(() => {
          console.log('navigating')
          navigateWithTrip('DestinationSetting')
        })
      }
    }, [])

    return (
      <Screen>
        <View>{/* <Image src={airport} /> */}</View>
      </Screen>
    )
  },
)

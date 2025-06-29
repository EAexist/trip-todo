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
    const {userStore, tripStore} = rootStore
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      if (userStore.trip.length > 0) {
        rootStore.fetchTrip(userStore.trip[-1]).then(() => {
          navigateWithTrip('Todolist')
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

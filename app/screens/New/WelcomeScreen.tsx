import {FC, useEffect} from 'react'
//
import {Screen} from '@/components/Screen'
import {useStores} from '@/models'
import {AppStackScreenProps, useNavigate} from '@/navigators'
// import BottomSheet from '@gorhom/bottom-sheet'
import {observer} from 'mobx-react-lite'
import * as airport from 'assets/images/airport.gif'
import {Image} from '@rneui/themed'
import {View} from 'react-native'
import {api} from '@/services/api'

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const {tripStore} = useStores()
    const {navigateWithTrip} = useNavigate()

    useEffect(() => {
      tripStore.create().then(() => {
        console.log(tripStore)
        navigateWithTrip('DestinationSetting')
      })
    }, [])

    return (
      <Screen>
        <View>
          <Image src={airport} />
        </View>
      </Screen>
    )
  },
)

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

export const WelcomeScreen: FC<AppStackScreenProps<'Welcome'>> = observer(
  () => {
    const {checklistStore} = useStores()
    const {navigateWithChecklist} = useNavigate()

    useEffect(() => {
      checklistStore.create().then(() => {
        console.log(checklistStore)
        navigateWithChecklist('DestinationSetting')
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

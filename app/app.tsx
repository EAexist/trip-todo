/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require('./devtools/ReactotronConfig.ts')
}
import {i18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import * as Linking from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import {useEffect, useState} from 'react'
import {KeyboardProvider} from 'react-native-keyboard-controller'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import {initI18n} from './i18n'
import {useInitialRootStore} from './models'
import {AppNavigator, useNavigationPersistence} from './navigators'
import {loadDateFnsLocale} from './utils/formatDate'
import './utils/gestureHandler'
import * as storage from './utils/storage'
import {useFonts} from 'expo-font'
import {Platform} from 'react-native'

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
  screens: {
    Main: {
      path: 'trip/:tripId?',
      screens: {
        Todolist: '/',
        Reservation: '/reservation',
      },
    },
    // Main: {
    //   screens: {
    //     Todolist: 'trip/:tripId?/todolist',
    //     Reservation: 'trip/:tripId?/reservation',
    //   },
    // },

    Login: 'login',
    Welcome: 'welcome',
    DestinationSetting: 'new/:tripId/destination',
    DestinationSearch: 'new/:tripId/destination/search',
    ScheduleSetting: 'new/:tripId/schedule',
    TitleSetting: 'new/:tripId/title',
    TodolistSetting: 'new/:tripId/trip',

    /*  */
    TripMeta: 'trip/:tripId?/meta',
    TodolistAdd: 'trip/:tripId?/add',
    TodolistDelete: 'trip/:tripId?/delete',
    TodolistReorder: 'trip/:tripId?/reorder',

    /*  */
    TodoCreate: 'trip/:tripId?/todo/:todoId?/create',
    TodoEdit: 'trip/:tripId?/todo/:todoId?/edit',
    TodoTitle: 'trip/:tripId?/todo/:todoId?/title',
    TodoNote: 'trip/:tripId?/todo/:todoId?/note',

    /*  */
    DepartureAirportSetting: 'trip/:tripId?/todo/:todoId?/departure',
    ArrivalAirportSetting: 'trip/:tripId?/todo/:todoId?/arrival',
    RoundTripSetting: 'trip/:tripId?/todo/:todoId?/roundTrip',

    /*  */
    ConfirmPassport: 'trip/:tripId?/todo/:todoId?/confirmPassport',
    ConfirmFlight: 'trip/:tripId?/todo/:todoId?/confirmFlight',
    ConfirmFlightTicket: 'trip/:tripId?/todo/:todoId?/confirmFlightTicket',

    /*  */
    AccomodationPlan: 'trip/:tripId?/accomodationPlan',
    Accomodation: 'trip/:tripId?/accomodation/:accomodationId?',
    AccomodationNote: 'trip/:tripId?/accomodation/:accomodationId?/note',
    CreateAccomodation: 'trip/:tripId?/createAccomodation',

    FullScreenImage:
      'trip/:tripId?/reservation/:reservationId?/fullScreenImage',
  },
}
const customFontsToLoad = {
  'Pretendard Variable': require('assets/fonts/pretendard/PretendardVariable.ttf'),
  Tossface: require('assets/fonts/tossface/Tossface.ttf'),
  //   Pretendard: require('assets/fonts/pretendard/PretendardVariable.woff2'),
}
/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] =
    Platform.OS == 'web' ? useFonts(customFontsToLoad) : [true, true]

  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const {rehydrated} = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    setTimeout(SplashScreen.hideAsync, 500)
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (
    !rehydrated ||
    !isNavigationStateRestored ||
    !isI18nInitialized ||
    (!areFontsLoaded && !fontLoadError)
  ) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // https://lingui.dev/tutorials/react-native#internationalization-in-react-native
  i18n.loadAndActivate({locale: 'ko', messages: {}})
  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <I18nProvider i18n={i18n}>
          <AppNavigator
            linking={linking}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </I18nProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}

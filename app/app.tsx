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
import './utils/gestureHandler'
import {initI18n} from './i18n'
import {useFonts} from 'expo-font'
import {useEffect, useState} from 'react'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import {useInitialRootStore} from './models'
import {AppNavigator, useNavigationPersistence} from './navigators'
import * as storage from './utils/storage'
import {customFontsToLoad} from './theme'
import {KeyboardProvider} from 'react-native-keyboard-controller'
import {loadDateFnsLocale} from './utils/formatDate'
import {I18nProvider} from '@lingui/react'
import {i18n} from '@lingui/core'

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
  screens: {
    // Login: {
    //   path: '',
    // },
    // Welcome: 'welcome',
    // Demo: {
    //   screens: {
    //     DemoShowroom: {
    //       path: 'showroom/:queryIndex?/:itemIndex?',
    //     },
    //     DemoDebug: 'debug',
    //     DemoPodcastList: 'podcast',
    //     DemoCommunity: 'community',
    //   },
    // },
    /*  */
    Welcome: 'welcome',
    DestinationSetting: 'new/:tripId/destination',
    DestinationSearch: 'new/:tripId/destination/search',
    ScheduleSetting: 'new/:tripId/schedule',
    TitleSetting: 'new/:tripId/title',
    TodolistSetting: 'new/:tripId/trip',
    /*  */
    Todolist: 'trip/:tripId?',
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
    ConfirmPassport: 'confirm/passport/id',
    ConfirmFlight: 'confirm/flight/id',
    /*  */
    AccomodationPlan: 'trip/:tripId?/accomodationPlan',
    Accomodation: 'trip/:tripId?/accomodation/:accomodationId?',
    AccomodationNote: 'trip/:tripId?/accomodation/:accomodationId?/note',
  },
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

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
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

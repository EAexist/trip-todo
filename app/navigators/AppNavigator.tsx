/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {BackButton} from '@/components/Header'
import theme from '@/rneui/theme'
import * as Screens from '@/screens'
import {useThemeProvider} from '@/utils/useAppTheme'
import {NavigationContainer} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import {Header, ThemeProvider, useTheme} from '@rneui/themed'
import {observer} from 'mobx-react-lite'
import {ComponentProps} from 'react'
import Config from '../config'
import {useStores} from '../models'
import {navigationRef, useBackButtonHandler} from './navigationUtilities'
import {FabProvider} from '@/components/Fab'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
type ChecklistStackProps = {checklistId: string}

export type AppStackParamList = {
  // 🔥 Your screens go here
  /* Create Checklist */
  Welcome: undefined
  DestinationSetting: ChecklistStackProps
  DestinationSearch: ChecklistStackProps
  ScheduleSetting: ChecklistStackProps
  TitleSetting: ChecklistStackProps
  ChecklistSetting: ChecklistStackProps
  /* Edit Checklist */
  Checklist: ChecklistStackProps
  ChecklistAdd: ChecklistStackProps
  ChecklistDelete: ChecklistStackProps
  ChecklistReorder: ChecklistStackProps
  /* Confirm */
  ConfirmPassport: ChecklistStackProps & {checklistItemId: string}
  ConfirmFlight: ChecklistStackProps & {checklistItemId: string}
  /* Edit ChecklistItem */
  ChecklistItemTitle: ChecklistStackProps & {checklistItemId: string}
  ChecklistItemNote: ChecklistStackProps & {checklistItemId: string}
  ChecklistItemCreate: ChecklistStackProps & {checklistItemId: string}
  /* Accomodation */
  AccomodationPlan: ChecklistStackProps & {accomodationId: string}
  Accomodation: ChecklistStackProps & {accomodationId: string}
  AccomodationNote: ChecklistStackProps & {accomodationId: string}
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: {isAuthenticated},
  } = useStores()

  const {
    theme: {colors},
  } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header leftComponent={<BackButton />} />,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? 'Welcome' : 'Welcome'}>
      {isAuthenticated ? (
        <></>
      ) : (
        <>
          {/* <Stack.Group> */}
          <Stack.Screen name="Welcome" component={Screens.New.Welcome} />
          <Stack.Screen
            name="DestinationSetting"
            component={Screens.New.DestinationSetting}
          />
          <Stack.Screen
            name="ScheduleSetting"
            component={Screens.New.ScheduleSetting}
          />
          <Stack.Screen
            name="DestinationSearch"
            component={Screens.New.DestinationSearch}
          />
          <Stack.Screen
            name="TitleSetting"
            component={Screens.New.TitleSetting}
          />
          <Stack.Screen
            name="ChecklistSetting"
            component={Screens.New.ChecklistSetting}
          />
          <Stack.Screen
            name="ChecklistItemCreate"
            component={Screens.Checklist.Create}
          />
          {/* <Stack.Screen
              name="New"
              component={Screens.DestinationSettingScreen}
            /> */}
          {/* </Stack.Group> */}
          {/* <Stack.Group> */}
          <Stack.Screen
            name="Checklist"
            component={Screens.Checklist.ChecklistScreen}
          />
          <Stack.Screen name="ChecklistAdd" component={Screens.Checklist.Add} />
          <Stack.Screen
            name="ChecklistReorder"
            component={Screens.Checklist.Reorder}
          />
          <Stack.Screen
            name="ChecklistDelete"
            component={Screens.Checklist.Delete}
          />
          <Stack.Screen
            name="ConfirmPassport"
            component={Screens.Confirm.Passport}
          />
          <Stack.Screen
            name="ConfirmFlight"
            component={Screens.Confirm.Flight}
          />
          <Stack.Screen
            name="AccomodationPlan"
            component={Screens.Accomodation.Plan}
          />
          <Stack.Screen
            name="Accomodation"
            component={Screens.Accomodation.Detail}
          />
          <Stack.Screen
            name="AccomodationNote"
            component={Screens.Accomodation.Note}
          />
          <Stack.Screen
            name="ChecklistItemNote"
            component={Screens.Checklist.Note}
          />
          <Stack.Screen
            name="ChecklistItemTitle"
            component={Screens.Checklist.Title}
          />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<
    ComponentProps<typeof NavigationContainer<AppStackParamList>>
  > {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const {
    themeScheme,
    navigationTheme,
    setThemeContextOverride,
    ThemeProvider: AppThemeProvider,
  } = useThemeProvider()

  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  return (
    <AppThemeProvider value={{themeScheme, setThemeContextOverride}}>
      <ThemeProvider theme={theme}>
        <NavigationContainer
          ref={navigationRef}
          theme={{
            ...navigationTheme,
            colors: {
              ...navigationTheme.colors,
              background: 'transparent',
            },
          }}
          {...props}>
          <FabProvider>
            <Screens.ErrorBoundary catchErrors={Config.catchErrors}>
              <AppStack />
            </Screens.ErrorBoundary>
          </FabProvider>
        </NavigationContainer>
      </ThemeProvider>
    </AppThemeProvider>
  )
})

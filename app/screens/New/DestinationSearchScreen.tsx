import {GooglePlacesSearchBarInput} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {goBack} from '@/navigators'
import {useLingui} from '@lingui/react/macro'
import countryNameKrToISOJSON from 'app/utils/countryNameKrToISO.json'
import {FC, useCallback, useEffect, useRef} from 'react'
import {
  AutocompleteRequestType,
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
  Query,
  Styles,
} from 'react-native-google-places-autocomplete'
import {DestinationListItemBase} from './DestinationSettingScreen'

/* https://github.com/FaridSafi/react-native-google-places-autocomplete */

const lang = 'ko'

const PlacesAutoCompleteQuery: Query<AutocompleteRequestType> = {
  key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
  language: lang, // language of the results
  types: '(cities)',
}

const GooglePlacesSearchBar = () => {
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  useEffect(() => {
    ref.current?.focus()
    console.log('APIKEY', process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY)
  }, [ref])

  const {t} = useLingui()
  const countryNameKrToISO = countryNameKrToISOJSON as {[key: string]: string}

  const {tripStore} = useStores()
  //   const {navigateWithTrip} = useNavigate()

  const handlePress = useCallback((data: GooglePlaceData) => {
    tripStore
      .createDestination({
        title: data.structured_formatting.main_text,
        state: data.structured_formatting.secondary_text,
        nation:
          countryNameKrToISO[
            data.structured_formatting.secondary_text.split(',')[0]
          ] || '',
      })
      .then(() => {
        goBack()
      })
  }, [])

  const renderRow = useCallback((data: GooglePlaceData, index: number) => {
    return (
      <DestinationListItemBase
        item={{
          title: data.structured_formatting.main_text,
          state: data.structured_formatting.secondary_text,
          nation:
            countryNameKrToISO[
              data.structured_formatting.secondary_text.split(' ')[0]
            ] || '',
        }}
      />
    )
  }, [])

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      debounce={1000}
      onPress={handlePress}
      onFail={error => console.error(error)}
      textInputProps={{
        InputComp: GooglePlacesSearchBarInput,
        leftIcon: {
          name: 'search',
        },
        autoFocus: true,
      }}
      placeholder={t`도시 또는 나라 이름 검색`}
      query={PlacesAutoCompleteQuery}
      requestUrl={{
        useOnPlatform: 'web', // or "all"
        url: 'http://localhost:8081/maps.googleapis.com/maps/api/', // or any proxy server that hits https://maps.googleapis.com/maps/api
        headers: {
          Authorization: `an auth token`, // if required for your proxy
        },
      }}
      enablePoweredByContainer={false}
      renderRow={renderRow}
      styles={$googlePlaceSearchBarStyle}
      listEmptyComponent={<></>}
    />
  )
}

const $googlePlaceSearchBarStyle: Partial<Styles> = {
  listView: {},
  textInputContainer: {},
  row: {
    padding: 0,
  },
}

export const DestinationSearchScreen: FC = () => {
  const {tripStore} = useStores()

  const {t} = useLingui()

  const titleText = tripStore.isDestinationSet ? (
    <TransText h2>
      <TransText h2 primary>
        {tripStore.destinationTitles.map(title => title).join('')}
      </TransText>
      {'와\n함께 방문할 도시를 검색해주세요'}
    </TransText>
  ) : (
    '방문할 도시를 검색해주세요'
  )

  return (
    <Screen>
      <ContentTitle title={titleText} />
      <GooglePlacesSearchBar />
    </Screen>
  )
}

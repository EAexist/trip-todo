import {GooglePlacesSearchBarInput} from '@/components/Input'
import ContentTitle from '@/components/Layout/Content'
import {Screen} from '@/components/Screen'
import {TransText} from '@/components/TransText'
import {useStores} from '@/models'
import {useLingui} from '@lingui/react/macro'
import {FC, useCallback, useEffect, useRef} from 'react'
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_API_UR

const GooglePlacesSearchBar = () => {
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [ref])

  const {t} = useLingui()

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      onPress={(data, details) => console.log(data, details)}
      textInputProps={{
        InputComp: GooglePlacesSearchBarInput,
        leftIcon: {
          name: 'search',
        },
        // errorStyle: {color: 'red'},
      }}
      placeholder={t`도시 또는 국가 검색`}
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: 'en', // language of the results
      }}
      requestUrl={{
        useOnPlatform: 'web', // or "all"
        url: 'http://localhost:3000/', // or any proxy server that hits https://maps.googleapis.com/maps/api
        headers: {
          Authorization: `an auth token`, // if required for your proxy
        },
      }}
    />
  )
}

export const DestinationSearchScreen: FC = () => {
  const {checklistStore} = useStores()
  const handleNextPress = useCallback(() => {
    // Handle next button press
    console.log('Next button pressed')
  }, [])

  const handleSearchChange = useCallback((text: string) => {
    console.log('Search input changed:', text)
  }, [])

  // const KeywordMatchedDestinations = db.destinations
  // const renderDestinationSearchResultItem: ListRenderItem<Destination> =
  //   useCallback(
  //     ({ item }) => <DestinationSearchResultItem {...item} />,
  //     [],
  //   )

  const {t} = useLingui()

  const titleText = checklistStore.isDestinationSet ? (
    <TransText h2>
      <TransText h2 primary>
        {checklistStore.destinationTitles.map(title => title).join('')}
      </TransText>
      {'와\n함께 방문할 도시를 검색해주세요'}
    </TransText>
  ) : (
    '방문할 도시를 검색해주세요'
  )

  return (
    <Screen>
      <ContentTitle title={titleText} />
      {/* <View style={styles.TextField}> */}
      <GooglePlacesSearchBar
      // inputStyle={styles.Text6}
      // containerStyle={styles.InputContainer}
      // inputContainerStyle={styles.InputUnderline}
      // leftIcon={
      //   <Icon name="search" type="material" color="#6B7684" size={24} />
      // }
      // labelStyle={styles.Text4}
      // placeholderTextColor="#6b7684"
      // onChangeText={handleSearchChange} // Added handler for text input
      />
      {/* </View> */}
      {/* <FlatList
        data={KeywordMatchedDestinations}
        renderItem={renderDestinationSearchResultItem}
        keyExtractor={(item) => item.name}
      /> */}
      {/* <Fab.Container>
        <Fab.NextButton onPress={handleNextPress} />
      </Fab.Container> */}
    </Screen>
  )
}

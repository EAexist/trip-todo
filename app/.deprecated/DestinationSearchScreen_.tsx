// import {GooglePlacesSearchBarInput} from '@/components/Input'
// import ContentTitle from '@/components/Layout/Content'
// import {Screen} from '@/components/Screen'
// import {TransText} from '@/components/TransText'
// import TripTodoGooglePlacesAutoComplete from '@/components/TripTodoGooglePlacesAutoComplete'
// import {useStores} from '@/models'
// import {useLingui} from '@lingui/react/macro'
// import {FC, useCallback, useEffect, useRef} from 'react'
// import {
//   GooglePlacesAutocomplete,
//   GooglePlacesAutocompleteRef,
// } from 'react-native-google-places-autocomplete'

// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// const GooglePlacesSearchBar = () => {
//   const ref = useRef<GooglePlacesAutocompleteRef>(null)

//   useEffect(() => {
//     ref.current?.focus()
//     console.log('APIKEY', process.env.GOOGLE_PLACES_API_KEY)
//   }, [ref])

//   const {t} = useLingui()

//   return (
//     <GooglePlacesAutocomplete
//       ref={ref}
//       onPress={(data, details) => console.log(data, details)}
//       onFail={error => console.error(error)}
//       textInputProps={{
//         InputComp: GooglePlacesSearchBarInput,
//         leftIcon: {
//           name: 'search',
//         },
//         // errorStyle: {color: 'red'},d
//       }}
//       placeholder={t`도시 또는 국가 검색`}
//       query={{
//         key: process.env.GOOGLE_PLACES_API_KEY,
//         language: 'en', // language of the results
//       }}
//       requestUrl={{
//         useOnPlatform: 'web', // or "all"
//         url: 'http://localhost:3000/', // or any proxy server that hits https://maps.googleapis.com/maps/api
//         headers: {
//           Authorization: `an auth token`, // if required for your proxy
//         },
//       }}
//     />
//   )
// }

// export const DestinationSearchScreen: FC = () => {
//   const {tripStore} = useStores()
//   const handleNextPress = useCallback(() => {
//     // Handle next button press
//     console.log('Next button pressed')
//   }, [])

//   const handleSearchChange = useCallback((text: string) => {
//     console.log('Search input changed:', text)
//   }, [])

//   // const KeywordMatchedDestinations = db.destination
//   // const renderDestinationSearchResultItem: ListRenderItem<Destination> =
//   //   useCallback(
//   //     ({ item }) => <DestinationSearchResultItem {...item} />,
//   //     [],
//   //   )

//   const {t} = useLingui()

//   const titleText = tripStore.isDestinationSet ? (
//     <TransText h2>
//       <TransText h2 primary>
//         {tripStore.destinationTitles.map(title => title).join('')}
//       </TransText>
//       {'와\n함께 방문할 도시를 검색해주세요'}
//     </TransText>
//   ) : (
//     '방문할 도시를 검색해주세요'
//   )

//   return (
//     <Screen>
//       <ContentTitle title={titleText} />
//       {/* <View style={styles.TextField}> */}
//       <TripTodoGooglePlacesAutoComplete />
//       {/* </View> */}
//       {/* <FlatList
//         data={KeywordMatchedDestinations}
//         renderItem={renderDestinationSearchResultItem}
//         keyExtractor={(item) => item.name}
//       /> */}
//       {/* <Fab.Container>
//         <Fab.NextButton onPress={handleNextPress} />
//       </Fab.Container> */}
//     </Screen>
//   )
// }

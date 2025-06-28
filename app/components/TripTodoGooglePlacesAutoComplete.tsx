// import {ListItem} from '@rneui/base'
// import {FC, useCallback, useEffect, useState} from 'react'
// import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
// import {FlatList, View} from 'react-native'
// import {SearchBase} from './Input'
// import GooglePlacesSDK from 'react-native-google-places-sdk'

// /* https://github.com/ErrorPro/react-google-autocomplete/blob/master/docs/debounce.js */

// const TripTodoGooglePlacesAutoComplete: FC = ({}) => {
//   const {placePredictions, getPlacePredictions, isPlacePredictionsLoading} =
//     usePlacesService({
//       apiKey: process.env.GOOGLE_PLACES_API_KEY,
//     })

//   const [value, setValue] = useState('')

//   const handleChangeText = useCallback((input: string) => {
//     setValue(input)
//   }, [])

//   useEffect(() => {
//     GooglePlacesSDK.fetchPredictions(
//       'Mumbai', // query
//       {countries: ['in', 'us']}, // filters
//     )
//       .then(predictions => console.log(predictions))
//       .catch(error => console.log(error))
//   }, [value])

//   return (
//     <View>
//       {/* <Autocomplete
//         apiKey={process.env.GOOGLE_PLACES_API_KEY}
//         // onPlaceSelected={place => console.log(place)}
//       /> */}
//       <SearchBase
//         value={value}
//         placeholder={`도시 또는 국가 검색`}
//         onChangeText={handleChangeText}
//         // loading={isPlacePredictionsLoading}
//       />

//       {!isPlacePredictionsLoading && (
//         <FlatList
//           data={placePredictions}
//           renderItem={({item}) => (
//             <ListItem>
//               <ListItem.Title>{item.description}</ListItem.Title>
//             </ListItem>
//           )}
//         />
//       )}
//     </View>
//   )
// }

// export default TripTodoGooglePlacesAutoComplete

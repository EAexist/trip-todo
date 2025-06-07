import {Input} from '@rneui/themed'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_API_KEY'

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: 'en', // language of the results
      }}
      onPress={(data, details) => console.log(data, details)}
      textInputProps={{
        InputComp: Input,
        leftIcon: {type: 'font-awesome', name: 'chevron-left'},
        errorStyle: {color: 'red'},
      }}
      placeholder=""
    />
  )
}

export default GooglePlacesInput

import {googlePlacesAutocompleteConfig} from '@/components/GooglePlacesAutocompleteConfig'
import {GooglePlacesSearchBarInput} from '@/components/Input'
import {ListItemBase} from '@/components/ListItem'
import ListSubheader from '@/components/ListSubheader'
import {Location} from '@/models/Todo'
import {countryNameKrToISO, getFlagEmoji} from '@/utils/nation'
import {useLingui} from '@lingui/react/macro'
import {FC, ReactNode, useCallback, useEffect, useRef} from 'react'
import {
  AutocompleteRequestType,
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
  Query,
} from 'react-native-google-places-autocomplete'

const AirportSearchResultListItem: FC<{data: GooglePlaceData}> = ({data}) => {
  useEffect(() => {
    console.log(JSON.stringify(data))
  }, [])

  return (
    <ListItemBase
      avatarProps={{
        title: getFlagEmoji('KR'),
        size: 35,
        iconStyle: {fontFamily: 'tossface'},
      }}
      title={data.structured_formatting.main_text}
      subtitle={data.structured_formatting.secondary_text
        .split(' ')
        .splice(0, 2)
        .join('ㆍ')}
    />
  )
}

interface AirportAutocompleteProps {
  recommendationContent?: ReactNode
  handlePressSearchResult: (location: Location) => void
}
export const AirportAutocomplete: FC<AirportAutocompleteProps> = ({
  recommendationContent,
  handlePressSearchResult,
}) => {
  const {t} = useLingui()

  const handlePress = useCallback((data: GooglePlaceData) => {
    const lastTokenMatch =
      data.structured_formatting.main_text.match(/(\S+)\s*$/)
    const lastToken = lastTokenMatch ? lastTokenMatch[1] : ''

    const iataCode = /\(([A-Z]+)\)/.test(lastToken)
      ? lastToken.replace(/[()]/g, '').trim()
      : undefined
    const name = (
      !!iataCode
        ? data.structured_formatting.main_text.replace(/\(.*?\)/g, '')
        : data.structured_formatting.main_text
    ).trim()

    handlePressSearchResult({
      title: name
        .replace('공항', '')
        .replace('국제', '')
        .replace(' ', '')
        .trim(),
      name: name,
      iataCode: iataCode || undefined,
      nation:
        countryNameKrToISO[
          data.structured_formatting.secondary_text.split(',')[0]
        ] || '',
    })
  }, [])
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  const renderRow = useCallback((data: GooglePlaceData, index: number) => {
    console.log(data)
    return <AirportSearchResultListItem key={data.id} data={data} />
  }, [])

  const lang = 'ko'

  const airportSearchQuery: Query<AutocompleteRequestType> = {
    key: process.env.GOOGLE_PLACES_API_KEY,
    language: lang,
  }

  return (
    <GooglePlacesAutocomplete
      {...googlePlacesAutocompleteConfig}
      requestUrl={{
        useOnPlatform: 'web',
        url: `${process.env.EXPO_PUBLIC_API_URL}/proxy/airport`,
      }}
      ref={ref}
      onPress={handlePress}
      textInputProps={{
        InputComp: GooglePlacesSearchBarInput,
        leftIcon: {
          name: 'search',
        },
        autoFocus: true,
      }}
      placeholder={t`공항 또는 도시 이름 검색`}
      query={airportSearchQuery}
      renderRow={renderRow}
      renderHeaderComponent={() => <ListSubheader title={'검색 결과'} />}
      inbetweenCompo={recommendationContent}
    />
  )
}

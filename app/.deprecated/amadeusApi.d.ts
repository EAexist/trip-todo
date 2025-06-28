/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {Location} from '@/models/Todo'
import Amadeus from 'amadeus'
import {ReferenceDataLocationsParams} from 'amadeus-ts'

declare class AmadeusApi {
  amadeus
  constructor()
  async fetchLocations(
    params: ReferenceDataLocationsParams,
  ): Promise<ApiResult<Location[]>>
}
declare const amadeusApi: AmadeusApi
export default amadeusApi

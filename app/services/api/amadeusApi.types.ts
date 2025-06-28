/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */

import {ReferenceDataLocationsResult} from 'amadeus-ts'

export type ReferenceDataLocationsReturnedResponse = {
  statusCode: number
  result: ReferenceDataLocationsResult
  data: ReferenceDataLocationsResult['data']
}

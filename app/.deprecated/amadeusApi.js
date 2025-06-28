/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import Amadeus from 'amadeus'

// export interface CreateTodoRequest {
//   category?: string
//   presetId?: number
// }

// type ApiResult<T> = {kind: 'ok'; data: T} | GeneralApiProblem

class AmadeusApi {
  amadeus
  constructor() {
    this.amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    })
  }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async fetchLocations(params) {
    const response = await this.amadeus.referenceData.locations.get({
      view: 'LIGHT',
      ...params,
    })

    if (response.statusCode !== 200) {
      throw Error(response.statusCode.toString())
    }
    try {
      if (!response.data) {
        throw Error
      }
      const rawData = response.data
      return {
        kind: 'ok',
        data: rawData.map(l => ({
          title: l.name || '',
          iataCode: l.iataCode,
          name: l.name || '',
        })),
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }
}
const amadeusApi = new AmadeusApi()
export default amadeusApi

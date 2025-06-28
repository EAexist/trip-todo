/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {Location} from '@/models/Todo'
import Amadeus, {ReferenceDataLocationsParams} from 'amadeus-ts'
import {ReferenceDataLocationsReturnedResponse} from './amadeusApi.types'
import {type ApiConfig} from './api.types'
import {GeneralApiProblem} from './apiProblem'

type ApiResult<T> = {kind: 'ok'; data: T} | GeneralApiProblem

/**
 * Configuring the apisauce instance.
 */
export const AMADEUS_API_CONFIG: ApiConfig = {
  baseURL: process.env.EXPO_PUBLIC_AMADEUS_API_URL,
  //   withCredentials: true,
  timeout: 10000,
}

export class AmadeusApi {
  amadeus: Amadeus
  constructor() {
    console.log(
      `[AmadeusApi] ${process.env.AMADEUS_CLIENT_ID} ${process.env.AMADEUS_CLIENT_SECRET} ${process.env.EXPO_PUBLIC_API_URL}`,
    )
    this.amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    })
  }
  //   apisauce: ApisauceInstance
  //   config: ApiConfig
  //   constructor(config: ApiConfig = AMADEUS_API_CONFIG) {
  //     this.config = config
  //     this.apisauce = create({
  //       ...config,
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     })
  //   }

  /**
   * Gets a Trip data with given id.
   * @returns {kind} - Response Status.
   * @returns {...Trip} - Trip.
   */
  async fetchLocations(
    params: ReferenceDataLocationsParams,
  ): Promise<ApiResult<Location[]>> {
    const response: ReferenceDataLocationsReturnedResponse =
      await this.amadeus.referenceData.locations.get({
        view: 'LIGHT',
        ...params,
      })
    console.log(`[fetchLocations] ${JSON.stringify(response.data)}`)
    // const handledResponse =
    //   handleResponse<ReferenceDataLocationsResult>(response)
    // return handledResponse.kind === 'ok'
    //   ? {
    //       kind: 'ok',
    //       data: handledResponse.data.data.map(l => ({
    //         title: l.name || '',
    //         iataCode: l.iataCode,
    //         name: l.name || '',
    //       })),
    //     }
    //   : handledResponse
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

export const amadeusApi = new AmadeusApi()

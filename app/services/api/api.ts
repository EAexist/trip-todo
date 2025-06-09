/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {AccomodationItemSnapshotIn} from '@/models/AccomodationItem'
import {Todo, TodoSnapshotIn} from '@/models/Todo'
import {
  TripStore,
  TripStoreSnapshot,
  Preset,
} from '@/models/TripStore'
import {ApiResponse, ApisauceInstance, create} from 'apisauce'
import type {
  ApiAccomodationResponse,
  ApiTodoResponse,
  ApiCreateTripResponse,
  ApiConfig,
  ApiPresetResponse,
} from './api.types'
import {GeneralApiProblem, getGeneralApiProblem} from './apiProblem'
import {defaultTrip} from '@/models/defaultTrip'

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
}
/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  //   async getEpisodes(): Promise<
  //     {kind: 'ok'; episodes: EpisodeSnapshotIn[]} | GeneralApiProblem
  //   > {
  //     // make the api call
  //     const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
  //       `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
  //     )

  //     // the typical ways to die when calling an api
  //     if (!response.ok) {
  //       const problem = getGeneralApiProblem(response)
  //       if (problem) return problem
  //     }

  //     // transform the data into the format we are expecting
  //     try {
  //       const rawData = response.data

  //       // This is where we transform the data into the shape we expect for our MST model.
  //       const episodes: EpisodeSnapshotIn[] =
  //         rawData?.items.map(raw => ({
  //           ...raw,
  //         })) ?? []

  //       return {kind: 'ok', episodes}
  //     } catch (e) {
  //       if (__DEV__ && e instanceof Error) {
  //         console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
  //       }
  //       return {kind: 'bad-data'}
  //     }
  //   }
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getTrip(
    id: string,
  ): Promise<({kind: 'ok'} & TripStoreSnapshot) | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiCreateTripResponse> =
      await this.apisauce.get(`trip/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      console.log(response.data)
      const {id, ...rawData} = response.data

      return {
        kind: 'ok',
        id: id.toString(),
        // startDateISOString: startDate,
        // endDateISOString: endDate,
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }
  async createTrip(): Promise<
    ({kind: 'ok'} & TripStoreSnapshot) | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ApiCreateTripResponse> =
      /* @TODO
        Block this and unblock following line when connecting to the constructed backend.
        defaultTrip is only used for mocking the backend with json-server
     */
      await this.apisauce.post(`trip`, defaultTrip)
    // await this.apisauce.post(`trip`, {})

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      const {id, ...rawData} = response.data
      return {
        kind: 'ok',
        id: id.toString(),
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }

  async putTrip(
    trip: TripStoreSnapshot,
  ): Promise<({kind: 'ok'} & TripStoreSnapshot) | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiCreateTripResponse> =
      /* @TODO
        Block this and unblock following line when connecting to the constructed backend.
        defaultTrip is only used for mocking the backend with json-server
     */
      await this.apisauce.put(`/trip/${trip.id}`, trip)
    // await this.apisauce.post(`trip`, {})

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      const {id, ...rawData} = response.data
      return {
        kind: 'ok',
        id: id.toString(),
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }

  async createTodo(
    tripId: string,
    item: Omit<TodoSnapshotIn, 'id'>,
  ): Promise<({kind: 'ok'} & TodoSnapshotIn) | GeneralApiProblem> {
    // make the api call
    console.log(`[createTodo] item=${JSON.stringify(item)}`)
    const response: ApiResponse<ApiTodoResponse> =
      await this.apisauce.post(`/trip/${tripId}/todo`, item)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      const {id, ...rawData} = response.data
      return {
        kind: 'ok',
        id: id.toString(),
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }

  async getTodos(
    tripId: string,
  ): Promise<({kind: 'ok'} & TripStoreSnapshot) | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiCreateTripResponse> =
      await this.apisauce.get(`/trip/${tripId}/todo`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      const {id, ...rawData} = response.data
      return {
        kind: 'ok',
        id: id.toString(),
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }

  async updateTrip(
    trip: Omit<TripStoreSnapshot, 'id' | 'activeItem' | 'preset'>,
  ): Promise<({kind: 'ok'} & TripStoreSnapshot) | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiCreateTripResponse> =
      await this.apisauce.post(`trip`, trip)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      if (!response.data) {
        throw Error
      }
      const {id, ...rawData} = response.data
      return {
        kind: 'ok',
        id: id.toString(),
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getPreset(id: string): Promise<
    | ({kind: 'ok'} & {
        preset: Preset[]
      })
    | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ApiPresetResponse> = await this.apisauce.get(
      `trip/${id}/preset`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      if (!rawData) {
        throw Error
      }

      return {
        kind: 'ok',
        ...rawData,
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return {kind: 'bad-data'}
    }
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getAccomodationItem(): Promise<
    ({kind: 'ok'} & {items: AccomodationItemSnapshotIn[]}) | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ApiAccomodationResponse> =
      await this.apisauce.get(`trip/1/accomodation`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      if (!rawData) {
        throw Error
      }
      console.log(rawData)
      return {
        kind: 'ok',
        items: rawData.items.map(item => ({
          checkinDateISOString: item.checkinDate,
          checkoutDateISOString: item.checkoutDate,
          checkinStartTimeISOString: item.checkinStartTime,
          checkinEndTimeISOString: item.checkinEndTime,
          checkoutTimeISOString: item.checkoutTime,
          ...item,
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

// Singleton instance of the API for convenience
export const api = new Api()

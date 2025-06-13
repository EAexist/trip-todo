import {AccomodationItemSnapshotIn} from '@/models/AccomodationItem'
import {PresetTodoContentSnapshotIn, Todo, TodoSnapshotIn} from '@/models/Todo'
import {TripStoreSnapshot, Preset, TripStore} from '@/models/TripStore'
import {getSnapshot} from 'mobx-state-tree'

/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
// export interface EpisodeItem {
//   title: string
//   pubDate: string
//   link: string
//   guid: string
//   author: string
//   thumbnail: string
//   description: string
//   content: string
//   enclosure: {
//     link: string
//     type: string
//     length: number
//     duration: number
//     rating: {scheme: string; value: string}
//   }
//   categories: string[]
// }

// export interface ApiFeedResponse {
//   status: string
//   feed: {
//     url: string
//     title: string
//     link: string
//     author: string
//     description: string
//     image: string
//   }
//   items: EpisodeItem[]
// }

export interface TodoDTO
  extends Omit<TodoSnapshotIn, 'id' | 'isFlaggedToDelete'> {
  id: number
  isPreset: boolean
  order_key?: number
}

export interface CreateTodoDTO extends Omit<TodoDTO, 'id'> {
  tripId: number
}

export const mapToTodoDTO: (
  todo: TodoSnapshotIn,
  order_key?: number,
  trip_id?: number,
) => TodoDTO = (todo, order_key, trip_id) => ({
  ...todo,
  id: Number(todo.id),
  isPreset: false,
  order_key: order_key,
  trip_id: trip_id,
})

export const mapToTodo: (todo: TodoDTO) => TodoSnapshotIn = todo => ({
  ...todo,
  id: todo.id.toString(),
  isFlaggedToDelete: false,
})

export interface TripDTO
  extends Omit<TripStoreSnapshot, 'id' | 'todoMap' | 'todolist'> {
  id: number
  todolist: TodoDTO[]
}

export const mapToTripDTO: (trip: TripStore) => TripDTO = trip => ({
  ...getSnapshot(trip),
  id: Number(trip.id),
  todolist: Array.from(trip.todolist.values())
    .map(todolist => {
      return todolist.map((todo, index) =>
        mapToTodoDTO(trip.todoMap.get(todo.id) as TodoSnapshotIn, index),
      )
    })
    .flat(),
})

export const mapToTrip: (tripDTO: TripDTO) => TripStoreSnapshot = tripDTO => {
  const categories = [...new Set(tripDTO.todolist.map(todo => todo.category))]
  return {
    ...tripDTO,
    id: tripDTO.id.toString(),
    todoMap: tripDTO.todolist.reduce((acc: {[key: string]: any}, todoDTO) => {
      acc[todoDTO.id.toString()] = mapToTodo(todoDTO)
      return acc
    }, {}),
    todolist: categories.reduce((acc: {[key: string]: any}, category) => {
      acc[category] = tripDTO.todolist
        .filter(todo => todo.category === category)
        .toSorted((a, b) => (a.order_key as number) - (b.order_key as number))
        .map(todo => todo.id.toString())
      return acc
    }, {}),
  }
}

export type WithStatus<T> = T & {
  status: string
}

export interface PresetDTO extends Omit<PresetTodoContentSnapshotIn, 'id'> {
  id: number
}

export interface ApiPresetResponse {
  preset: PresetDTO[]
  status: string
}

export interface ApiAccomodationResponse {
  //  Omit<TripStoreSnapshot, 'startDate' | 'endDate'> {
  status: string
  items: (Omit<
    AccomodationItemSnapshotIn,
    | 'checkinDateISOString'
    | 'checkoutDateISOString'
    | 'checkinStartTimeISOString'
    | 'checkinEndTimeISOString'
    | 'checkoutTimeISOString'
  > & {
    checkinDate: string
    checkoutDate: string
    checkinStartTime: string
    checkinEndTime: string
    checkoutTime: string
  })[]
  // startDate: string
  // endDate: string
}
/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

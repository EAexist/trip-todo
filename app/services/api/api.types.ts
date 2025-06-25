import {AccomodationItemSnapshotIn} from '@/models/AccomodationItem'
import {PresetTodoContentSnapshotIn, Todo, TodoSnapshotIn} from '@/models/Todo'
import {TripStoreSnapshot, Preset, TripStore} from '@/models/TripStore'
import {ApisauceConfig} from 'apisauce'
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
  id?: number
}

export interface CreateTodoDTO extends Omit<TodoDTO, 'id'> {
  tripId: number
}

export const mapToTodoDTO: (
  todo: TodoSnapshotIn,
  //   orderKey?: number,
  //   trip_id?: number,
) => TodoDTO = todo => ({
  ...todo,
  id: todo.id ? Number(todo.id) : undefined,
  //   isPreset: false,
  //   orderKey: orderKey,
  //   trip_id: trip_id,
})

export const mapToTodo: (todo: TodoDTO) => Partial<TodoSnapshotIn> = todo => ({
  ...todo,
  id: todo.id?.toString(),
  title: todo.title || '',
  note: todo.note || '',
  iconId: todo.iconId || '',
  isFlaggedToDelete: false,
})

export interface TripDTO
  extends Omit<
    TripStoreSnapshot,
    'id' | 'todoMap' | 'todolist' | 'accomodation'
  > {
  id: number
  todolist: TodoDTO[]
  accomodation: AccomodationItemSnapshotIn[]
}

export const mapToTripDTO: (trip: TripStore) => TripDTO = trip => ({
  ...getSnapshot(trip),
  id: Number(trip.id),
  todolist: Array.from(trip.todolist.values())
    .map(todolist => {
      return todolist.map((todo, index) =>
        mapToTodoDTO(trip.todoMap.get(todo.id) as TodoSnapshotIn),
      )
    })
    .flat(),
  accomodation: Array.from(trip.accomodation.values()),
})

export const mapToTrip: (tripDTO: TripDTO) => TripStoreSnapshot = tripDTO => {
  const categories = [...new Set(tripDTO.todolist.map(todo => todo.category))]
  return {
    ...tripDTO,
    id: tripDTO.id.toString(),
    todoMap: tripDTO.todolist.reduce((acc: {[key: string]: any}, todoDTO) => {
      if (todoDTO.id) acc[todoDTO.id?.toString()] = mapToTodo(todoDTO)
      return acc
    }, {}),
    todolist: categories.reduce((acc: {[key: string]: any}, category) => {
      acc[category] = tripDTO.todolist
        .filter(todo => todo.category === category)
        .toSorted((a, b) => (a.orderKey as number) - (b.orderKey as number))
        .map(todo => todo.id?.toString())
      return acc
    }, {}),
    accomodation: tripDTO.accomodation.reduce(
      (acc: {[key: string]: any}, accomodation) => {
        acc[accomodation.id.toString()] = accomodation
        return acc
      },
      {},
    ),
  }
}

export const mapToPresetTodo: (
  preset: TodoPresetDTO,
) => PresetTodoContentSnapshotIn = preset => ({
  ...preset,
  id: preset.id.toString(),
})

export type WithStatus<T> = T & {
  status: string
}

export interface TodoPresetDTO extends Omit<PresetTodoContentSnapshotIn, 'id'> {
  id: number
}

export interface ApiPresetResponse {
  preset: TodoPresetDTO[]
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
export interface ApiConfig extends ApisauceConfig {
  //   /**
  //    * The URL of the api.
  //    */
  //   url: string
  //   /**
  //    * Milliseconds before we timeout the request.
  //    */
  //   timeout: number
}

import {
  getSnapshot,
  Instance,
  onAction,
  SnapshotOut,
  types,
} from 'mobx-state-tree'
import {api} from '../services/api'
import {
  CATEGORY_TO_TITLE,
  Todo,
  TodoModel,
  TodoSnapshotIn,
  defaultTodo,
} from './Todo'
import {DestinationModel} from './Destination'
import {withSetPropAction} from './helpers/withSetPropAction'

export const PresetItemModel = types
  .model('Preset')
  .props({
    isFlaggedToAdd: types.boolean,
    item: types.reference(TodoModel),
  })
  .actions(withSetPropAction)
  .actions(presetItem => ({
    toggleAddFlag() {
      presetItem.setProp('isFlaggedToAdd', !presetItem.isFlaggedToAdd)
    },
  }))

export interface Preset extends Instance<typeof PresetItemModel> {}

export const TripStoreModel = types
  .model('TripStore')
  .props({
    id: '',
    title: '',
    destinations: types.array(DestinationModel),
    startDateISOString: types.maybe(types.string), // Ex: 2022-08-12 21:05:36
    endDateISOString: types.maybe(types.string), // Ex: 2022-08-12 21:05:36
    todoMap: types.map(TodoModel),
    todos: types.map(types.array(types.reference(TodoModel))),
    preset: types.array(PresetItemModel),
    activeItem: types.maybe(types.reference(TodoModel)),
    // _presets: types.model({
    //   reservation: types.array(TodoModel),
    //   foreign: types.array(TodoModel),
    //   goods: types.array(TodoModel),
    // }),
    // doSync: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    initalizeTripKeys() {
      // Array.from(store.todoMap.values()).forEach(item =>
      //   store.todos.push(item),
      // )
    },
    createItem(item: TodoSnapshotIn) {
      store.todoMap.put(item)
      store.todos.get(item.category)?.push(item.id)
    },
    addItem(item: TodoSnapshotIn) {
      store.todos.get(item.category)?.push(item.id)
    },
    // _addItem(item: Todo) {
    //   store.todoMap.put(item)
    //   store.todos.push(item)
    // },
    // addPreset(preset: Preset) {
    //   store.preset.push({
    //     isFlaggedToAdd: preset.isFlaggedToAdd,
    //     item: preset.item.id,
    //   })
    // },
    set(trip: TripStoreSnapshot) {
      store.setProp('id', trip.id)
      store.setProp('title', trip.title)
      store.setProp('destinations', trip.destinations)
      store.setProp('startDateISOString', trip.startDateISOString)
      store.setProp('endDateISOString', trip.endDateISOString)
      store.setProp(
        'todoMap',
        trip.todoMap,
        // Object.fromEntries(
        //   trip.todos.map(item => [item.id, item]),
        // ),
      )
      store.setProp('todos', trip.todos)
      /* Nested Object: UseSetProps */
      store.setProp('preset', trip.preset)
    },
  }))
  .actions(store => ({
    add(item: TodoSnapshotIn) {
      store.todoMap.put(item)
      store.addItem(item)
    },
  }))
  .actions(store => ({
    add(item: TodoSnapshotIn) {
      store.todoMap.put(item)
      store.addItem(item)
    },
    /**
     * Create an empty trip and fetch it with backend-generated id.
     */
    async create() {
      const response = (await api.createTrip()) as TripStoreSnapshot
      store.set(response)
    },
    /**
     * Create an empty trip and fetch it with backend-generated id.
     */
    async fetch(id: string) {
      const response = await api.getTrip(id)
      if (response.kind === 'ok') {
        store.set(response as TripStoreSnapshot)
      } else {
        console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
      }
      console.log(store)
    },
    async put() {
      const response = (await api.putTrip(
        getSnapshot(store),
      )) as TripStoreSnapshot
      store.set(response)
    },
    // async fetchPreset() {
    //   const response = await api.getPreset('1')
    //   console.log(response)
    //   if (response.kind === 'ok') {
    //     response.preset.forEach(preset => {
    //       store.addItem(preset.item)
    //       store.addPreset(preset)
    //     })
    //     console.log(store.preset)
    //   } else {
    //     console.error(`Error fetching Trip: ${JSON.stringify(response)}`)
    //   }
    // },
    async createTodo(
      item: Partial<Omit<TodoSnapshotIn, 'id'>>,
    ) {
      const response = (await api.createTodo(store.id, {
        ...defaultTodo,
        ...item,
      })) as TodoSnapshotIn
      store.add(response)
      return response.id
    },
    setActiveItem(todo?: Todo) {
      console.log('SETACTIVE', todo?.title)
      store.setProp('activeItem', todo ? todo.id : undefined)
    },
    removeActiveItem() {
      // console.log('SETACTIVE', todo?.title)
      store.setProp('activeItem', undefined)
    },
    remove(item: Todo) {
      store.todos.get(item.category)?.remove(item)
      if (!store.preset.map(({item}) => item).includes(item))
        store.todoMap.delete(item.id)
    },
    initializePreset() {
      // https://stackoverflow.com/questions/39007637/javascript-set-vs-array-performance
      // const usedPresets = new Set(data.map((item) => item.type))
      // const usedPreset = Array.from(store.todos.values()).map(
      //   item => item.type,
      // )
      // const preset = presets.filter(
      //   item => !usedPreset.includes(item.type as string),
      // ).map(item=> {isFlaggedTo})
      // .map((item) => ({
      //   isPreset: true,
      //   ...item,
      // }))
      // store.setProp('preset', preset)
    },
    // flagToAdd(presetId: string) {
    //   if (!(presetId in store.addFlaggedPresetIds))
    //     store.addFlaggedPresetIds.push(presetId)
    //   else store.addFlaggedPresetIds.push(presetId)
    // },
  }))
  .views(store => ({
    // get preset() {
    //   return Array.from(store.preset.values())
    // },
    get startDate() {
      return store.startDateISOString
        ? new Date(store.startDateISOString)
        : undefined
    },
    get endDate() {
      return store.endDateISOString
        ? new Date(store.endDateISOString)
        : undefined
    },
    get isScheduleSet() {
      return this.startDate !== undefined
    },
    get isDestinationSet() {
      return store.destinations.length > 0
    },
    get destinationTitles() {
      return store.destinations.map(item => item.title)
      // return store.destinations.map((item) => item.title).join(', ')
    },
    get passportExpiryRequiredAfterThisDate() {
      const daysPadding = 1
      const passportExpiryRequiredAfterThisDate = this.endDate?.setDate(
        this.endDate?.getDate() + daysPadding,
      )
      const date = this.endDate?.getDate()
      const month = this.endDate?.toLocaleDateString('en', {
        month: 'short',
      })
      const monthLocale = this.endDate?.toLocaleDateString(undefined, {
        month: 'short',
      })
      const year = this.endDate?.getFullYear()
      return `${date} ${monthLocale && `${monthLocale}/`}${month} ${year}`
    },
    get nonEmptysections() {
      return Array.from(store.todos.entries())
        .filter(([category, data]) => data.length > 0)
        .map(([category, _]) => ({
          category,
          title: CATEGORY_TO_TITLE[category],
          data: [category],
        }))
    },
    get sections() {
      return [
        ...new Set(
          Array.from(store.todoMap.values()).map(
            item => item.category,
          ),
        ),
      ]
    },
    get sectionedTrip() {
      return Array.from(store.todos.entries()).map(
        ([category, data]) => ({
          category,
          title: CATEGORY_TO_TITLE[category],
          data,
        }),
      )
    },
    get sectionedNonEmptyTrip() {
      return this.sectionedTrip.filter(({data}) => data.length > 0)
    },
    get incompleteTrip() {
      return this.sectionedNonEmptyTrip.map(({title, data}) => {
        return {title, data: data.filter(item => !item.completeDateISOString)}
      })
    },
    get completedTrip() {
      return this.sectionedNonEmptyTrip
        .map(({title, data}) => {
          return {
            title,
            data: data.filter(item => !!item.completeDateISOString),
          }
        })
        .filter(({data}) => data.length > 0)
    },
    get deleteFlaggedTrip() {
      return this.sectionedNonEmptyTrip.map(({title, data}) => {
        // const completeData = data.sort((a, b) =>
        //   a.isFlaggedToDelete === b.isFlaggedToDelete
        //     ? 0
        //     : b.isFlaggedToDelete
        //       ? -1
        //       : 1,
        // )
        return {
          title,
          data: data.toSorted((a, b) =>
            a.isFlaggedToDelete === b.isFlaggedToDelete
              ? 0
              : b.isFlaggedToDelete
                ? -1
                : 1,
          ),
        }
      })
    },
    get tripWithPreset() {
      console.log(
        this.sections.map(category => {
          const addedItems = store.todos.get(category)
          const addedItemIds = addedItems?.map(item => item.id) as string[]
          return {
            category,
            title: CATEGORY_TO_TITLE[category],
            data: addedItems
              ?.map(item => ({isPreset: false, preset: {item}}))
              .concat(
                store.preset
                  .filter(
                    ({item}) =>
                      item.category === category && !addedItems.includes(item),
                  )
                  // .filter(({item}) => )
                  .map(preset => {
                    console.log(preset.item.id, addedItemIds)
                    return {
                      isPreset: true,
                      preset,
                    }
                  }),
              ) as {isPreset: boolean; preset: Preset}[],
          }
        }),
      )
      return this.sections.map(category => {
        const addedItems = store.todos.get(category)
        const addedItemIds = addedItems?.map(item => item.id) as string[]
        return {
          category,
          title: CATEGORY_TO_TITLE[category],
          data: addedItems
            ?.map(item => ({isPreset: false, preset: {item}}))
            .concat(
              store.preset
                .filter(
                  ({item}) =>
                    item.category === category && !addedItems.includes(item),
                )
                // .filter(({item}) => )
                .map(preset => {
                  console.log(preset.item.id, addedItemIds)
                  return {
                    isPreset: true,
                    preset,
                  }
                }),
            ) as {isPreset: boolean; preset: Preset}[],
        }
      })
    },
    get isActive() {
      return store.activeItem !== undefined
    },
    // get TripForList() {
    //   return store.favoritesOnly ? store.favorites : store.Trip
    // },
    // hasFavorite(item: Todo) {
    //   return store.favorites.includes(todo)
    // },
  }))
  .actions(store => ({
    async deleteItems() {
      Array.from(store.todoMap.values())
        .filter(item => item.isFlaggedToDelete)
        .forEach(item => {
          item.setProp('isFlaggedToDelete', false)
          store.remove(item)
        })
      store.put()
    },
    async addFlaggedPreset() {
      store.preset
        .filter(preset => preset.isFlaggedToAdd)
        .forEach(preset => {
          store.addItem(preset.item)
          preset.setProp('isFlaggedToAdd', false)
        })
      store.put()
    },
    async reorder(category: string, ids: string[]) {
      store.todos.set(category, ids)
      store.put()
    },
    // setPreset() {
    //   store.setProp('_presets', [])
    // },
    // toggleFavorite(item: Todo) {
    //   if (store.hasFavorite(todo)) {
    //     store.removeFavorite(todo)
    //   } else {
    //     store.addFavorite(todo)
    //   }
    // },
  }))

// reaction(()=>
// )

export interface TripStore extends Instance<typeof TripStoreModel> {}
export interface TripStoreSnapshot
  extends SnapshotOut<typeof TripStoreModel> {}

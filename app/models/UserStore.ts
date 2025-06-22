import {api} from '@/services/api'
import {KakaoProfile} from '@react-native-seoul/kakao-login'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'
import {User} from '@react-native-google-signin/google-signin'

export const UserStoreModel = types
  .model('UserStore')
  .props({
    authToken: types.maybe(types.string),
    id: types.maybe(types.number),
    nickname: types.maybe(types.string),
    trip: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views(store => ({
    get isAuthenticated() {
      //   return true
      return !!store.authToken
    },
  }))
  .actions(store => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    logout() {
      store.authToken = undefined
    },
    setUser(user: UserStoreSnapshot) {
      store.setProp('authToken', user.authToken)
      store.setProp('id', user.id)
      store.setProp('nickname', user.nickname)
      store.setProp('trip', user.trip)
    },
  }))
  .actions(store => ({
    async kakaoLogin(idToken: string, profile: KakaoProfile) {
      api.kakaoLogin(idToken, profile).then(response => {
        if (response.kind == 'ok') {
          store.setUser(response.data)
        }
      })
    },
    async googleLogin(idToken: string, data: User) {
      api.googleLogin(idToken, data).then(response => {
        if (response.kind == 'ok') {
          store.setUser(response.data)
        }
      })
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}

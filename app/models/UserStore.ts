import {api, GoogleUserDTO} from '@/services/api'
import {KakaoProfile} from '@react-native-seoul/kakao-login'
import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {withSetPropAction} from './helpers/withSetPropAction'

export const UserStoreModel = types
  .model('UserStore')
  .props({
    // authToken: types.maybe(types.string),
    id: types.maybeNull(types.number),
    nickname: types.maybe(types.string),
    trip: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views(store => ({
    get isAuthenticated() {
      //   return true
      return !!store.id
    },
  }))
  .actions(store => ({
    // setAuthToken(value?: string) {
    //   store.authToken = value
    // },
    // logout() {
    //   store.authToken = undefined
    // },
    setUser(user: UserStoreSnapshot) {
      store.setProp('id', user.id)
      store.setProp('nickname', user.nickname)
      store.setProp('trip', user.trip)
    },
  }))
  .actions(store => ({
    async kakaoLogin(idToken: string, profile: KakaoProfile) {
      console.log(
        `[UserStore.kakaoLogin] idToken=${idToken} profile=${JSON.stringify(profile)}`,
      )
      api.kakaoLogin(idToken, profile).then(response => {
        console.log(
          `[UserStore.kakaoLogin] response=${response.kind} ${JSON.stringify(response)}`,
        )
        if (response.kind == 'ok') {
          store.setUser(response.data)
        }
      })
    },
    async googleLogin(googleUser: GoogleUserDTO) {
      api.googleLogin(googleUser).then(response => {
        // console.log(`[api.googleLogin] response=${JSON.stringify(response)}`)
        if (response.kind == 'ok') {
          store.setUser(response.data)
        }
      })
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}

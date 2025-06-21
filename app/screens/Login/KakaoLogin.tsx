import {
  getProfile as getKakaoProfile,
  login,
} from '@react-native-seoul/kakao-login'
import {useCallback, useState} from 'react'
import {StyleSheet} from 'react-native'

export const useKakaoLogin = useCallback(() => {
  const [result, setResult] = useState<string>('')

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login()
      setResult(JSON.stringify(token))
    } catch (err) {
      console.error('login err', err)
    }
  }

  const getProfile = async (): Promise<void> => {
    try {
      const profile = await getKakaoProfile()

      setResult(JSON.stringify(profile))
    } catch (err) {
      console.error('signOut error', err)
    }
  }

  return {
    signInWithKakao,
  }
}, [])

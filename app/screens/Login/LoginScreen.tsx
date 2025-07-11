import { FC, useCallback } from 'react'
//
import { Container } from '@/components/Fab'
import { GoogleLoginButton } from '@/components/Login/GoogleLoginButton'
import { LoginButton } from '@/components/Login/LoginButton'
import { Screen } from '@/components/Screen'
import { useStores } from '@/models'
import { AppStackScreenProps } from '@/navigators'
import { loadString, saveString } from '@/utils/storage'
import { useHeader } from '@/utils/useHeader'
import {
    getProfile,
    KakaoOAuthToken,
    login,
} from '@react-native-seoul/kakao-login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Image, Text } from '@rneui/themed'
import * as appIcon from 'assets/images/app/app-icon.png'
import { observer } from 'mobx-react-lite'
import { Platform, View } from 'react-native'

export const LoginScreen: FC<AppStackScreenProps<'Login'>> = observer(() => {
    const { userStore } = useStores()

    const handleKakaoLoginPress = useCallback(async () => {
        console.log(`[handleKakaoLoginPress]`)
        const token: KakaoOAuthToken = await login()
        // .then(token =>
        //   console.log(`[handleKakaoLoginPress] token=${token}`),
        // )
        console.log(`[handleKakaoLoginPress] token=${token}`)
        const profile = await getProfile()
        console.log(`[handleKakaoLoginPress] profile=${profile}`)
        await userStore.kakaoLogin(token.idToken, profile)
    }, [])

    useHeader({ backButtonShown: false })

    return (
        <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_CLIENT_ID_WEB}>
            <Screen>
                <View style={{ alignItems: 'center', padding: 64 }}>
                    <Image source={appIcon} containerStyle={{}} style={{}} />
                    <Text style={{ fontSize: 32, padding: 24 }}>TRIP TODO</Text>
                </View>
                <Container fixed={false}>
                    {/* <KakaoLoginButton onPress={handleKakaoLoginPress} /> */}
                    <GoogleLoginButton />
                    {
                        Platform.OS === 'web' &&
                        <LoginButton
                            onPress={async () => {
                                await userStore.guestLogin()
                            }}
                            title="로그인 없이 사용해보기"
                        />
                    }
                </Container>
            </Screen>
        </GoogleOAuthProvider>
    )
})

const saveIdToken = async (idToken: string) => {
    saveString('googleIdToken', idToken)
}

const getIdToken = async () => {
    return loadString('googleIdToken')
}

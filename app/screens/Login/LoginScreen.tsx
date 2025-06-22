import {FC, useCallback} from 'react'
//
import {Container} from '@/components/Fab'
import {Screen} from '@/components/Screen'
import {AppStackScreenProps} from '@/navigators'
import {api} from '@/services/api'
import {useHeader} from '@/utils/useHeader'
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import {getProfile, login} from '@react-native-seoul/kakao-login'
import {Button, ButtonProps, Image, Text} from '@rneui/themed'
import * as appIcon from 'assets/images/app/app-icon.png'
import * as g from 'assets/images/third-party/g.png'
import * as kakaoSymbol from 'assets/images/third-party/kakao-symbol.svg'
import {observer} from 'mobx-react-lite'
import {ImageSourcePropType, Platform, StyleSheet, View} from 'react-native'
import {useStores} from '@/models'

const LoginButton: FC<ButtonProps & {symbolSource: ImageSourcePropType}> = ({
  symbolSource,
  title,
  buttonStyle,
  titleStyle,
  ...props
}) => (
  <Button
    buttonStyle={[$loginButtonStyle.buttonStyle, buttonStyle]}
    titleStyle={[$loginButtonStyle.titleStyle, titleStyle]}
    {...props}>
    <Image
      source={symbolSource}
      containerStyle={$loginButtonStyle.symbolContainerStyle}
      style={$loginButtonStyle.symbolStyle}
      resizeMode={'contain'}
    />
    {title}
  </Button>
)

const $loginButtonStyle = StyleSheet.create(
  Platform.OS === 'android'
    ? {
        buttonStyle: {
          paddingHorizontal: 10,
          paddingRight: 12,
        },
        titleStyle: {
          flexGrow: 1,
          fontSize: 14,
        },
        symbolContainerStyle: {
          width: 20,
          height: 20,
          paddingLeft: 12,
          paddingRight: 10,
        },
        symbolStyle: {width: 20, height: 20},
      }
    : {
        buttonStyle: {
          paddingHorizontal: 10,
          paddingRight: 16,
        },
        titleStyle: {flexGrow: 1, fontSize: 14},
        symbolContainerStyle: {
          width: 20,
          height: 20,
          paddingLeft: 16,
          paddingRight: 12,
        },
        symbolStyle: {width: 20, height: 20},
      },
)

const KakaoLoginButton: FC<ButtonProps> = props => (
  <LoginButton
    title={'카카오로 시작하기'}
    buttonStyle={$kakaoButtonStyle.buttonStyle}
    titleStyle={$kakaoButtonStyle.titleStyle}
    symbolSource={kakaoSymbol}
    {...props}
  />
)

const GoogleLoginButton: FC<ButtonProps> = props => (
  <LoginButton
    title={'구글로 시작하기'}
    buttonStyle={$googleButtonStyle.buttonStyle}
    titleStyle={$googleButtonStyle.titleStyle}
    symbolSource={g}
    {...props}
  />
)

/* https://developers.kakao.com/docs/latest/ko/kakaosync/design-guide */
const $kakaoButtonStyle = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FEE500',
    paddingVertical: 10,
  },
  titleStyle: {color: '#191919'},
})

/* https://developers.google.com/identity/branding-guidelines */
const $googleButtonStyle = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#747775',
    borderWidth: 1,
    paddingVertical: 10,
  },
  titleStyle: {color: '#1F1F1F'},
})

const _signIn = async () => {
  try {
    const {type, data} = await GoogleSignin.signIn()
    if (type === 'success') {
      console.log({data})
      return data
      // this.setState({userInfo: data, error: undefined})
    } else {
      // sign in was cancelled by user
      setTimeout(() => {
        console.log('cancelled')
      }, 500)
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      console.log('error', error.message)
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          console.log(
            'in progress',
            'operation (eg. sign in) already in progress',
          )
          break
        // case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        //   // android only
        //   console.log('play services not available or outdated')
        //   break
        default:
          console.log('Something went wrong: ', error.toString())
      }
      //   this.setState({
      //     error,
      //   })
    } else {
      alert(`an error that's not related to google sign in occurred`)
    }
  }
}

export const LoginScreen: FC<AppStackScreenProps<'Login'>> = observer(() => {
  const {userStore} = useStores()

  const handleKakaoLoginPress = useCallback(async () => {
    const token = await login()
    const profile = await getProfile()
    await userStore.kakaoLogin(token.idToken, profile)
  }, [])

  const handleGoogleLoginPress = useCallback(async () => {
    try {
      const {type, data} = await GoogleSignin.signIn()
      if (type === 'success') {
        console.log({data})
        const tokens = await GoogleSignin.getTokens()
        await userStore.googleLogin(tokens.idToken, data)
      } else {
        // sign in was cancelled by user
        setTimeout(() => {
          console.log('cancelled')
        }, 500)
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log('error', error.message)
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log(
              'in progress',
              'operation (eg. sign in) already in progress',
            )
            break
          // case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          //   // android only
          //   console.log('play services not available or outdated')
          //   break
          default:
            console.log('Something went wrong: ', error.toString())
        }
        //   this.setState({
        //     error,
        //   })
      } else {
        alert(`an error that's not related to google sign in occurred`)
      }
    }
  }, [])

  useHeader({backButtonShown: false})

  return (
    <Screen>
      <View style={{alignItems: 'center', padding: 64}}>
        <Image source={appIcon} containerStyle={{}} style={{}} />
        <Text style={{fontSize: 32, padding: 24}}>TRIP TODO</Text>
      </View>
      <Container fixed={false}>
        <KakaoLoginButton onPress={handleKakaoLoginPress} />
        <GoogleLoginButton onPress={handleGoogleLoginPress} />
        <GoogleLoginButton
          onPress={() => {
            userStore.setAuthToken('hello')
          }}
        />
      </Container>
    </Screen>
  )
})

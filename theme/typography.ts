// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import {Platform} from 'react-native'

export const customFontsToLoad = {
  //   'Pretendard-Thin': require('assets/fonts/pretendard/Pretendard-Thin.otf'),
  //   'Pretendard-Black': require('assets/fonts/pretendard/Pretendard-Black.otf'),
  //   'Pretendard-Bold': require('assets/fonts/pretendard/Pretendard-Bold.otf'),
  //   'Pretendard-ExtraBold': require('assets/fonts/pretendard/Pretendard-ExtraBold.otf'),
  //   'Pretendard-ExtraLight': require('assets/fonts/pretendard/Pretendard-ExtraLight.otf'),
  //   'Pretendard-Light': require('assets/fonts/pretendard/Pretendard-Light.otf'),
  //   'Pretendard-Medium': require('assets/fonts/pretendard/Pretendard-Medium.otf'),
  //   'Pretendard-Regular': require('assets/fonts/pretendard/Pretendard-Regular.otf'),
  //   'Pretendard-SemiBold': require('assets/fonts/pretendard/Pretendard-SemiBold.otf'),
  //   Tossface: require('assets/fonts/tossface/TossFaceFontMac.ttf'),
  // @TODO: DON"T KNOW WHY, BUT .WOFF2 NOT RESOLVED
  // 'Pretendard': require('assets/fonts/pretendard/PretendardVariable.woff2'),
}

const fonts = {
  //   pretendard: {
  //     thin: 'Pretendard-Thin',
  //     black: 'Pretendard-Black',
  //     bold: 'Pretendard-Bold',
  //     extraBold: 'Pretendard-ExtraBold',
  //     extraLight: 'Pretendard-ExtraLight',
  //     light: 'Pretendard-Light',
  //     medium: 'Pretendard-Medium',
  //     regular: 'Pretendard-Regular',
  //     semiBold: 'Pretendard-SemiBold',
  //   },
  //   spaceGrotesk: {
  //     // Cross-platform Google font.
  //     light: 'spaceGroteskLight',
  //     normal: 'spaceGroteskRegular',
  //     medium: 'spaceGroteskMedium',
  //     semiBold: 'spaceGroteskSemiBold',
  //     bold: 'spaceGroteskBold',
  //   },
  //   helveticaNeue: {
  //     // iOS only font.
  //     thin: 'HelveticaNeue-Thin',
  //     light: 'HelveticaNeue-Light',
  //     normal: 'Helvetica Neue',
  //     medium: 'HelveticaNeue-Medium',
  //   },
  //   courier: {
  //     // iOS only font.
  //     normal: 'Courier',
  //   },
  //   sansSerif: {
  //     // Android only font.
  //     thin: 'sans-serif-thin',
  //     light: 'sans-serif-light',
  //     normal: 'sans-serif',
  //     medium: 'sans-serif-medium',
  //   },
  //   monospace: {
  //     // Android only font.
  //     normal: 'monospace',
  //   },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  //   primary: fonts.pretendard,
  /**
   * An alternate font used for perhaps titles and stuff.
//    */
  //   secondary: Platform.select({
  //     ios: fonts.helveticaNeue,
  //     android: fonts.sansSerif,
  //   }),
  /**
   * Lets get fancy with a monospace font!
   */
  //   code: Platform.select({ios: fonts.courier, android: fonts.monospace}),
}

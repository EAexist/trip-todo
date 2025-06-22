// plugins/withComposeCompiler.ts
import {
  ConfigPlugin,
  withAppBuildGradle,
  withProjectBuildGradle,
} from 'expo/config-plugins'

// This plugin will modify the root build.gradle
const withComposeCompilerRootGradle: ConfigPlugin = config => {
  return withProjectBuildGradle(config, gradleConfig => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error(
        '[@your-plugin-name] Cannot add Compose Compiler plugin to root build.gradle because it is not groovy.',
      )
    }

    const newContents = gradleConfig.modResults.contents.replace(
      /^plugins \{/m,
      `plugins {
    id "org.jetbrains.kotlin.plugin.compose" version "2.0.21"
`,
    )

    gradleConfig.modResults.contents = newContents
    return gradleConfig
  })
}

// This plugin will modify the app/build.gradle
const withComposeCompilerAppGradle: ConfigPlugin = config => {
  return withAppBuildGradle(config, gradleConfig => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error(
        '[@your-plugin-name] Cannot apply Compose Compiler plugin to app build.gradle because it is not groovy.',
      )
    }

    const newContents = gradleConfig.modResults.contents.replace(
      /^plugins \{/m,
      `plugins {
    id "org.jetbrains.kotlin.plugin.compose"
`,
    )
    // Optional: Add composeCompiler block if needed
    //       .replace(
    //         /android \{/,
    //         `android {
    //     composeOptions {
    //         kotlinCompilerExtensionVersion "1.5.14" // Match this with your Kotlin version and Compose compiler compatibility
    //     }
    // `,
    //       )

    gradleConfig.modResults.contents = newContents
    return gradleConfig
  })
}

export const withComposeCompiler: ConfigPlugin = config => {
  config = withComposeCompilerRootGradle(config)
  config = withComposeCompilerAppGradle(config)
  return config
}

// export default withComposeCompiler

import { createTamagui } from 'tamagui'
import { config as v3Config } from '@tamagui/config/v3'
import { themes } from './src/theme/themes'

const tamaguiConfig = createTamagui({
  ...v3Config,
  themes,
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

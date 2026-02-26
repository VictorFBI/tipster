import { tokens } from "./tokens"


const light = {
  background: tokens.color.lightBg,
  background2: tokens.color.lightBg,
  text: tokens.color.gray11,
  textSecondary: tokens.color.gray3,
  border: tokens.color.lightBorder,
  
  accent: tokens.color.accent,
  
  surface: tokens.color.lightInput,
  surfaceSecondary: tokens.color.gray7,
  
  placeholder: tokens.color.gray5,

  error: tokens.color.error,
}

const dark = {
  background: tokens.color.darkBg,
  background2: tokens.color.darkBg2,
  text: tokens.color.white,
  textSecondary: tokens.color.darkSecondary,
  border: tokens.color.darkBorder,
  
  accent: tokens.color.accent,
  
  surface: tokens.color.gray,
  surfaceSecondary: tokens.color.gray13,
  
  placeholder: tokens.color.darkPlaceholder,

  error: tokens.color.error,
}



export const themes = {
  dark,
  light,
} 



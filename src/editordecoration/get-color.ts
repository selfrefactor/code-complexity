// import {window, ColorThemeKind} from 'vscode'
import { switcher } from 'rambdax'

// function isDarkTheme() {
//   const currentTheme = window.activeColorTheme.kind
//   return currentTheme === ColorThemeKind.Dark
// }

export let LIMIT_COMPLEXITY = 12
let STEP_COMPLEXITY = 12

const LEVEL1 = {
  level: LIMIT_COMPLEXITY,
  color: "#83ee88"
}
const LEVEL2 ={
  level: LIMIT_COMPLEXITY + STEP_COMPLEXITY,
  color: "#3636ff"
}

const LEVEL3 = {
  level: LIMIT_COMPLEXITY + STEP_COMPLEXITY * 2,
  color: "#ff3636"
}

// const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  return switcher<string>(complexity)
    .is(x => x <= LEVEL1.level, LEVEL1.color)
    .is(x => x <= LEVEL2.level, LEVEL2.color)
    .is(x => x <= LEVEL3.level, LEVEL3.color)
    .default('#f816f2')
}

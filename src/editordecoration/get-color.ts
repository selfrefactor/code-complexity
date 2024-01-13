import {window, ColorThemeKind} from 'vscode'
import { MIN_COMPLEXITY } from '../constants'

function isDarkTheme() {
  const currentTheme = window.activeColorTheme.kind
  return currentTheme === ColorThemeKind.Dark
}

const LEVEL1 = [
  "#83ee88",
  "#83dd88",
  "#83dd88",
  "#83ee88",
  "#83dd88",
  "#83dd88",
  "#83c488",
  "#83c488",
  "#83c488",
  "#83c488",
  "#83c488",
  "#83c488",
  ]

const LEVEL2 = [
  "#0000ff",
  "#0d0dff",
  "#1b1bff",
  "#2828ff",
  "#3636ff",
  "#4444ff",
  "#5151ff",
  "#5f5fff",
  "#6c6cff",
  "#7a7aff",
  "#8787ff"
]

const LEVEL3 =[
  "#ff0000",
  "#ff0d0d",
  "#ff1b1b",
  "#ff2828",
  "#ff3636",
  "#ff4444",
  "#ff5151",
  "#ff5f5f",
  "#ff6c6c",
  "#ff7a7a",
  "#ff8787"
]

const colorsLight = [...LEVEL1, ...LEVEL2, ...LEVEL3]
const colorsDark = [...LEVEL1.slice().reverse(), ...LEVEL2.slice().reverse(), ...LEVEL3.slice().reverse()]

const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  const actualIndex = complexity - MIN_COMPLEXITY
  return colors[actualIndex] ?? '#f816f2'
}

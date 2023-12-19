import {window, ColorThemeKind} from 'vscode'

function isDarkTheme() {
  const currentTheme = window.activeColorTheme.kind
  return currentTheme === ColorThemeKind.Dark
}

const LEVEL1 = [
  "#00ff00",
  "#05fa0d",
  "#0af51a",
  "#0ff127",
  "#14ec34",
  "#19e741",
  "#1fe34e",
  "#24de5b",
  "#29d968",
  "#2ed575",
  "#33d082",
  "#39cc8f"
  ]

const LEVEL2 = [
  "#52e7e1",
  "#4ad2e3",
  "#43bde6",
  "#3ba8e9",
  "#3493eb",
  "#2c7dee",
  "#2568f1",
  "#1d53f4",
  "#163ef6",
  "#0e29f9",
  "#0714fc",
  "#0000ff"
]

const LEVEL3 =[
  "#cd1d8d",
  "#d11a80",
  "#d61773",
  "#da1566",
  "#df1259",
  "#e30f4c",
  "#e80d40",
  "#ec0a33",
  "#f10726",
  "#f50519",
  "#fa020c",
  "#ff0000"
]

const colorsLight = [...LEVEL1, ...LEVEL2, ...LEVEL3]

const colorsDark = [...LEVEL1.slice().reverse(), ...LEVEL2.slice().reverse(), ...LEVEL3.slice().reverse()]

const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

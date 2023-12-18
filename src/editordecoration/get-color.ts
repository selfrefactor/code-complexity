import {window, ColorThemeKind} from 'vscode'

function isDarkTheme() {
  const currentTheme = window.activeColorTheme.kind
  return currentTheme === ColorThemeKind.Dark
}

const LEVEL1 = {
  light: [
    '#c3fec3',
    '#b1feb1',
    '#9ffe9f',
    '#8dfe8d',
    '#7cfe7c',
    '#6afe6a',
    '#58fe58',
    '#46fe46',
    '#35fe35',
    '#23fe23',
    '#11fe11',
    '#00ff00',
  ],
  dark: [
    '#c3fec3',
    '#b1feb1',
    '#9ffe9f',
    '#8dfe8d',
    '#7cfe7c',
    '#6afe6a',
    '#58fe58',
    '#46fe46',
    '#35fe35',
    '#23fe23',
    '#11fe11',
    '#00ff00',
  ],
}

const LEVEL2 = {
  light: [
    '#a1defd',
    '#92c9fd',
    '#83b5fd',
    '#75a1fd',
    '#668dfd',
    '#5779fd',
    '#4964fe',
    '#3a50fe',
    '#2b3cfe',
    '#1d28fe',
    '#0e14fe',
    '#0000ff',
  ],
  dark: [
    '#a1defd',
    '#92c9fd',
    '#83b5fd',
    '#75a1fd',
    '#668dfd',
    '#5779fd',
    '#4964fe',
    '#3a50fe',
    '#2b3cfe',
    '#1d28fe',
    '#0e14fe',
    '#0000ff',
  ],
}

const LEVEL3 = {
  light: [
    '#fb9bbe',
    '#fb8cac',
    '#fb7e9b',
    '#fc708a',
    '#fc6278',
    '#fc5467',
    '#fd4656',
    '#fd3845',
    '#fd2a33',
    '#fe1c22',
    '#fe0e11',
    '#ff0000',
  ],
  dark: [
    '#fb9bbe',
    '#fb8cac',
    '#fb7e9b',
    '#fc708a',
    '#fc6278',
    '#fc5467',
    '#fd4656',
    '#fd3845',
    '#fd2a33',
    '#fe1c22',
    '#fe0e11',
    '#ff0000',
  ],
}

const colorsLight = [...LEVEL1.light, ...LEVEL2.light, ...LEVEL3.light]

const colorsDark = [...LEVEL1.dark, ...LEVEL2.dark, ...LEVEL3.dark]

const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

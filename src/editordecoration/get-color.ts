import { window, ColorThemeKind } from "vscode";

function isDarkTheme() {
  const currentTheme = window.activeColorTheme.kind;
  return currentTheme === ColorThemeKind.Dark;
}

const colorsLight = [
  "#00ff00",
  "#08f600",
  "#11ed00",
  "#1ae400",
  "#23db00",
  "#2bd300",
  "#34ca00",
  "#3dc100",
  "#46b800",
  "#4faf00",
  "#57a700",
  "#609e00",
  "#699500",
  "#728c00",
  "#7b8300",
  "#837b00",
  "#8c7200",
  "#956900",
  "#9e6000",
  "#a75700",
  "#af4f00",
  "#b84600",
  "#c13d00",
  "#ca3400",
  "#d32b00",
  "#db2300",
  "#e41a00",
  "#ed1100",
  "#f60800",
  "#fe0000"
]

const colorsDark = [
  "#6ee7b7",
  "#73e3b7",
  "#78dfb8",
  "#7ddbb8",
  "#82d7b9",
  "#87d4b9",
  "#8cd0ba",
  "#91ccba",
  "#96c8bb",
  "#9bc4bb",
  "#a0c1bc",
  "#a5bdbc",
  "#aab9bd",
  "#afb5bd",
  "#b4b1be",
  "#b9aebe",
  "#beaabf",
  "#c3a6bf",
  "#c8a2c0",
  "#cd9ec0",
  "#d29bc1",
  "#d797c1",
  "#db93c2",
  "#e08fc2",
  "#e58bc3",
  "#ea88c3",
  "#ef84c4",
  "#f480c4",
  "#f97cc5",
  "#fe79c6"
]

const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

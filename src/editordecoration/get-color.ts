import { window, ColorThemeKind } from "vscode";

function isDarkTheme() {
  const currentTheme = window.activeColorTheme.kind;
  return currentTheme === ColorThemeKind.Dark;
}

const colorsLight = [
  "#00ff00",
  "#0bf300",
  "#16e800",
  "#21dd00",
  "#2cd200",
  "#37c700",
  "#42bc00",
  "#4db100",
  "#58a600",
  "#639b00",
  "#6e9000",
  "#798500",
  "#857900",
  "#906e00",
  "#9b6300",
  "#a65800",
  "#b14d00",
  "#bc4200",
  "#c73700",
  "#d22c00",
  "#dd2100",
  "#e81600",
  "#f30b00",
  "#fe0000"
]

const colorsDark = [
  "#6ee7b7",
  "#74e2b7",
  "#7addb8",
  "#80d8b8",
  "#87d3b9",
  "#8dcfba",
  "#93caba",
  "#9ac5bb",
  "#a0c0bc",
  "#a6bbbc",
  "#adb7bd",
  "#b3b2be",
  "#b9adbe",
  "#bfa8bf",
  "#c6a4c0",
  "#cc9fc0",
  "#d29ac1",
  "#d995c2",
  "#df90c2",
  "#e58cc3",
  "#ec87c4",
  "#f282c4",
  "#f87dc5",
  "#fe79c6"
]

const colors = isDarkTheme() ? colorsDark : colorsLight

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

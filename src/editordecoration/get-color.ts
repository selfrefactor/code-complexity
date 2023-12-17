const colors = [
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

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

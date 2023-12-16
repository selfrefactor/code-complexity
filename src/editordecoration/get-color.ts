const colors = [
  "#6ee7b7",
  "#74ddaf",
  "#7ad4a8",
  "#80cba1",
  "#86c29a",
  "#8cb993",
  "#92b08b",
  "#98a784",
  "#9e9e7d",
  "#a49576",
  "#aa8c6f",
  "#b08368",
  "#b67960",
  "#bc7059",
  "#c26752",
  "#c85e4b",
  "#ce5544",
  "#d44c3d",
  "#da4335",
  "#e03a2e",
  "#e63127",
  "#ec2820",
  "#f21f19",
  "#f81612"
]

export function getColor(complexity: number): string {
  return colors[complexity] ?? '#f816f2'
}

/**

const LOW_LEVEL = 7
const MID_LEVEL = 12
const HIGH_LEVEL = 18
const EXTREME_HIGH_LEVEL = 30

 * It calculates color on the base of complexity.
 * 
 * If complexity is less or equal LOW_LEVEL, it returns green color.
 * If complexity is between MID_LEVEL and HIGH_LEVEL, it returns orange color.
 * If complexity is above 20, it returns red color.
 * 
 * For each level, the opacity is calculated on the base of complexity, so that
 * with each high level, the opacity decreases.
 * For example, if complexity is 1, then color is green with opacity 1.
 * If complexity is 7, then color is green with opacity 0.1
function getColor(complexity: number): string {
  if (complexity <= LOW_LEVEL) {
      return `rgba(0, 255, 0, ${complexity / LOW_LEVEL})`
  } else if (complexity > LOW_LEVEL && complexity <= MID_LEVEL) {
      return `rgba(255, 165, 0, ${(complexity - LOW_LEVEL) / (MID_LEVEL - LOW_LEVEL)})`
  } else if (complexity > MID_LEVEL && complexity <= HIGH_LEVEL) {
      return `rgba(255, 0, 0, ${(complexity - MID_LEVEL) / (HIGH_LEVEL - MID_LEVEL)})`
  } else if (complexity > HIGH_LEVEL && complexity <= EXTREME_HIGH_LEVEL) {
      return `rgba(255, 0, 0, ${(complexity - HIGH_LEVEL) / (EXTREME_HIGH_LEVEL - HIGH_LEVEL)})`
  }
  return `#FF00FF`
}

 */
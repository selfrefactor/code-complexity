# Code Complexity - Fork of Code Metrics

![image](images/show.png)

Fork of https://github.com/kisstkondoros/codecomplexity

Differences:

- show complexity number inside the decoration; no need to hover to see the number
- instead of 4 levels of color decoration, there are 30 levels.
- no lua/vue/html support
- no second decoration, `CodeLensEnabled` is not used
- different color sets depending if current theme is dark or light

## Features

### Code Complexity

Instead of showing only 4 colors, it shows 30 colors. 
The color of the decoration is based on the complexity of the function.
Complexity of `0` is green and complexity of `30` is red.
Other levels are in between these two colors.

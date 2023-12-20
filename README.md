# Code Complexity - Fork of Code Metrics

![image](images/show.png)

Fork of https://github.com/kisstkondoros/codecomplexity

Differences:

- using latest dependencies - main reason for the fork was to be able to update dependencies
- show complexity number inside the decoration; no need to hover to see the number
- instead of 4 levels of color decoration, there are around 25 levels.
- no lua/vue/html support
- no second decoration, `CodeLensEnabled` is not used
- different color sets depending if current theme is dark or light

## Features

### Code Complexity

Instead of showing only 4 colors, it shows 25 colors. 

The color of the decoration is based on the complexity of the function.

Complexity value is shown inside decoration square.

Complexity between `0` and `12` is shown in green.
Complexity between `12` and `22` is shown in blue. 
Complexity between `22` and `32` is shown in red. 
Complexity above `32` is shown in purple.

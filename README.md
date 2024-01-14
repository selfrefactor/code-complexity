# Code Complexity - Fork of Code Metrics

![image](images/show.png)

Fork of https://github.com/kisstkondoros/codecomplexity

Differences:

- different way to show complexity. For complexity more than 12, number is shown inside the decoration. For complexity less than 12, decoration is shown as size of inner square.
- no change of decorations on unsaved changes; only on save event.
- hide decorations when file is dirty, i.e. changed but not yet saved. This helps with hanging decorations(decorations on wrong lines), but also to optimize performance.
- using latest dependencies - main reason for the fork was to be able to update dependencies
- limit to 50 decorations per file due to performance reasons
- no lua/vue/html support
- no second decoration, `CodeLensEnabled` is not used

## Features

### Code Complexity

Complexity value is shown inside decoration square if complexity is more than 12. If complexity is less than 12, decoration is shown as size of inner square.

Complexity between `0` and `12` is shown in green.

Complexity between `12` and `22` is shown in blue. 

Complexity between `22` and `32` is shown in red. 

Complexity above `32` is shown in purple.

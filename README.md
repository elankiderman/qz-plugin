# qz-plugin

This is an internal plugin for use at Quartz. It allows for inverting layer or artboard colors for light/dark themes.

## Usage

To install, download the latest [release](https://github.com/elankiderman/qz-plugin/releases). Double click the `.sketchplugin` file, or move it to your plugins folder.

## Invert
Cycle the colors between light and dark themes
To invert, select one or multiple layers, artboards, or symbol masters. Press `control` + `shift` + `i` to invert.

### Supported swap types
- fills
- borders
- type color
- symbols (by name)
- artboard background

### Supported color swaps
- #000000 / #ffffff
- #333333 / #f9f9f9
- #bebebe / #777777
- #4c4c4c / #e2e2e2
- e2e2e2 / #4c4c4c
- swaps out the word `light` in symbol names for `dark`, and vv., if such a symbol exists.


## Toggle device
Toggle between symbols or text styles by device
To toggle device, select one or multiple symbols or text layers. Press `control` + `shift` + `d`. Press multiple times to cycle through.

### Supported swap types
- symbols
- text styles

### Supported naming conventions
- for symbols: 'desktop (2000)', 'desktop (1440)', 'tablet', 'mobile'
- for text styles: 'desktop (1200)', 'desktop (1024)', 'tablet (768)', 'mobile'


## Toggle text size
Toggle between text styles by t-shirt size
To toggle size, select one or multiple symbols or text layers. Press `control` + `shift` + `s`. Press multiple times to cycle through.

Sizes are ordered based by font size value, and sometimes may appear out of order if there are multiple styles of the same size within a device.


## Nearest style
Given a text layer, find and apply nearest style match in our library
Select one or multiple text elements. Press `control` + `shift` + `n` to apply nearest text style.
If there are two or more matches, it will not apply the style
Font family and weight are determined by the given text element.
If the layer is within an artboard, device size is determined by the width of the parent artboard.
If the layer is within a symbol, device size is determined by the word `Desktop` `Tablet` or `Mobile` (case insensitive) in the symbol name.

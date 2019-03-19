# qz-plugin

This is an internal plugin for use at Quartz. It allows for inverting layer or artboard colors for light/dark themes.

## Usage

To install, download the latest [release](https://github.com/elankiderman/qz-plugin/releases). Double click the `.sketchplugin` file, or move it to your plugins folder.

## Invert

To invert, select one or multiple layers, artboards, or symbol masters. Press `control` + `option` + `i` to invert.

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
To toggle device, select one or multiple symbols or text layers. Press `control` + `option` + `d` to swap device. Press multiple times to cycle through.

### Supported swap types
- symbols
- text styles

### Supported naming conventions
- for symbols: 'desktop (2000)', 'desktop (1440)', 'tablet', 'mobile'
- for text styles: 'desktop (1200)', 'desktop (1024)', 'tablet (768)', 'mobile'






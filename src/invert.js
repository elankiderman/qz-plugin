import sketch from 'sketch'
const Style = sketch.Style
const symbolMaster = sketch.symbolMaster
const colorKey = {
  '#000000': '#ffffff',
  '#ffffff': '#000000',
  '#171922': '#f9f9f9',
  '#f9f9f9': '#171922',
  '#bebebe': '#777777',
  '#7777777': '#bebebe',
  '#4c4c4c': '#e2e2e2',
  '#e2e2e2': '#4c4c4c',
  '#76CBFF': '#168DD9',
  '#168DD9': '#76CBFF'
};
const document = sketch.getSelectedDocument();
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  const doc = sketch.getSelectedDocument()
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected')
  } else {
    iterateLayers(selectedLayers);
  }
}

function iterateLayers(selectedLayers) {
  selectedLayers.forEach(layer => {
    if (layer.type == 'Artboard' || layer.type == 'SymbolMaster') {
      swapArtboard(layer);
      iterateLayers(layer.layers);
    }
    else if (layer.type == 'Text') {
      swapText(layer);
    }
    else if (layer.type == 'SymbolInstance') {
      swapSymbol(layer);
    }
    else if (layer.type == 'Group') {
      console.log('group')
      iterateLayers(layer.layers);
    }
    else {
      console.log(layer.type);
      swapFill(layer);
      swapBorder(layer);
    }

  })

  sketch.UI.message('🔀 inverted colors')
}

function swapArtboard(artboard) {
  var backgroundColor = artboard.background.color;

  var newColor = colorSwap(backgroundColor);

  if(newColor) {
    artboard.background.color = newColor;
  }

}

function swapSymbol(layer) {
  var master = layer.master;
  var name = master.name;



  if(name.indexOf("dark") != -1 || name.indexOf("light") != -1) {


    var reverseName = (name.indexOf("light") != -1) ? name.replace("light", "dark") : name.replace("dark","light");


    var originLibrary = master.getLibrary();
    if(originLibrary) {
      var symbolReferences = originLibrary.getImportableSymbolReferencesForDocument(document);


      var reverseSymbols = symbolReferences.filter(symbol => {
        return symbol.name === reverseName;
      })

        if(reverseSymbols.length > 0) {
          var newMaster = reverseSymbols[0].import();
        }
      }
    else {
      var symbolReferences = document.getSymbols();
      var reverseSymbols = symbolReferences.filter(symbol => {
        return symbol.name === reverseName;
      })
      var newMaster = reverseSymbols[0];
    }

    if(reverseSymbols.length > 0) {
      layer.master = newMaster;
    }

  }


}

function swapFill(layer) {
  var fills = layer.style.fills;

  for (var i = 0; i < fills.length; i++) {
    var newColor = colorSwap(fills[i].color);

    if(newColor) {
      layer.style.fills[i].color = newColor;
    }
  }
}

function swapBorder(layer) {
  var borders = layer.style.borders;

  for (var i = 0; i < borders.length; i++) {
    var newColor = colorSwap(borders[i].color);

    if(newColor) {
      layer.style.borders[i].color = newColor;
    }
  }

}

function swapText(layer) {
  var newColor = colorSwap(layer.style.textColor);

  if(newColor) {
    layer.style.textColor = newColor;
    // layer.style.fills = [{
    //   fill: Style.FillType.Color,
    //   color: newColor,
    // }]
  }
}

function splitColor(rgba) {
  return {
      'rgb': rgba.substr(0, 7),
      'alpha': rgba.substr(7),
  };
}

function colorSwap(oldColor) {

  var oldRgba = splitColor(oldColor);

  var oldRgb = oldRgba.rgb;
  var alpha = oldRgba.alpha;

  var newRgb = colorKey[oldRgb];

  if(newRgb) {
    return newRgb + alpha;
  }

  else {
    return undefined;
  }


}

import sketch from 'sketch'
const Style = sketch.Style
var Library = require('sketch/dom').Library
const symbolMaster = sketch.symbolMaster
var library;
const document = sketch.getSelectedDocument();
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  library = getLibrary();
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
      //swapArtboard(layer);
      iterateLayers(layer.layers);
    }
    else if (layer.type == 'Text') {
      //do nothing
    }
    else if (layer.type == 'SymbolInstance') {
      swapSymbol(layer);
    }
    else if (layer.type == 'Group') {
      iterateLayers(layer.layers);
    }
    else {
      //do nothing
    }

  })

  sketch.UI.message('🔀 inverted operating system')
}

function swapSymbol(layer) {
  var master = layer.master;
  var name = master.name;



  if(name.indexOf("ios") != -1 || name.indexOf("android") != -1) {


    var reverseName = (name.indexOf("ios") != -1) ? name.replace("ios", "android") : name.replace("android","ios");


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
      layer.frame.width = newMaster.frame.width;
      layer.frame.height = newMaster.frame.height;

    }

  }


}

function getLibrary() {
  //get master library
  var libraries = Library.getLibraries()
  var thisLibrary;
  for(var i = 0; i < libraries.length; i++) {
    if(libraries[i].name.indexOf("Quartz library (Master") != -1) {
      thisLibrary = libraries[i]
    }
  }
  return(thisLibrary);
}

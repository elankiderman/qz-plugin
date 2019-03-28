import sketch from 'sketch'
const Style = sketch.Style
var Library = require('sketch/dom').Library
const symbolMaster = sketch.symbolMaster
const symbolDeviceKey = ['desktop (2000)', 'desktop (1440)', 'tablet', 'mobile'];
const textDeviceKey = ['desktop (1200)', 'desktop (1024)', 'tablet (768)', 'mobile']


const document = sketch.getSelectedDocument();

var library;
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  const selectedLayers = document.selectedLayers;
  const selectedCount = selectedLayers.length;

  library = getLibrary();

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
    iterateLayers(selectedLayers);
  }
}

function iterateLayers(selectedLayers) {
  selectedLayers.forEach(layer => {
    if(layer.type == 'Text') {
      console.log("performing operation")

      var styleReferences = library.getImportableTextStyleReferencesForDocument(document);

      var artboardWidth = getArtboardWidth(layer);
      if(artboardWidth) {
        var font = getFont(layer);

        artboardWidth = artboardWidth.replace("(", "\\(")
        artboardWidth = artboardWidth.replace(")", "\\)")

        var regex = new RegExp(font +' /.+/ ' + artboardWidth)

        var fontDeviceMatches = styleReferences.filter(style => {
          //console.log(style.name)
          return regex.test(style.name);
        })


        //find nearest text size
        console.log("doesn't have style, finding one")

        var currentSize = layer.style.fontSize;

        var matchingStyles = fontDeviceMatches.filter(style => {
          return style.import().style.fontSize === currentSize;
        })



        if(matchingStyles.length == 0) {
          sketch.UI.message("Didn't find any styles matching this text. swapped with closest style")
          var closestStyle = fontDeviceMatches[0]
          var maxDistance = Math.abs(fontDeviceMatches[0].import().style.fontSize - currentSize)
          for(var i = 0; i < fontDeviceMatches.length; i++) {
            var style = fontDeviceMatches[i];
            var newDistance = Math.abs(style.import().style.fontSize - currentSize)
            if(newDistance < maxDistance) {
              closestStyle = style;
              maxDistance = newDistance;
            }
          }

          applyStyle(layer,closestStyle)

        }
        else if(matchingStyles.length == 1) {
          var matchingStyle = matchingStyles[0]
          applyStyle(layer, matchingStyle)
        }
        else {
          sketch.UI.message('Found multiple styles matching this text')
        }
      }
      else {
        sketch.UI.message('can\'t guess style without a parent artboard/symbol')
      }




    }
    else {
      sketch.UI.message('not text')
    }

  })
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

function getArtboardWidth(layer) {
  //find parent Artboard

  if(layer.sharedStyle) {
    layer.sharedStyle = null;
  }

    while(layer && layer.type != 'Artboard' && layer.type != 'SymbolMaster') {
      layer = layer.parent;
    }

    if(layer && layer.type == 'Artboard') {
      var width = layer.frame.width;

      if(width >= 1200) {
        return textDeviceKey[0]
      }
      else if (width >= 1024) {
        return textDeviceKey[1]
      }
      else if (width >= 768) {
        return textDeviceKey[2]
      }
      else {
        return textDeviceKey[3]
      }
    }
    else if(layer && layer.type == 'symbolMaster') {
      var name = layer.name.toLowerCase();
      if(name.indexOf("desktop") != -1) {
        return textDeviceKey[0]
      }
      else if(name.indexOf("tablet") != -1) {
        return textDeviceKey[2]
      }
      else if(name.indexOf("mobile") != -1) {
        return textDeviceKey[3]
      }
    }
    else {
      return undefined
    }

}

function getFont(layer) {
  var fontFamily = layer.style.fontFamily;
  var fontWeight = layer.style.fontWeight;
  console.log("getFont")
  console.log(layer.style)


  if(!fontFamily) {
    fontFamily=layer.sharedStyle.style.fontFamily;
    fontWeight=layer.sharedStyle.style.fontWeight;
  }

  console.log("getfont " + layer.style.fontWeight)

  if(fontFamily == 'Maison Neue' && fontWeight == 6) {
    return 'maison medium'
  }
  else if(fontFamily == 'Maison Neue' && fontWeight == 10) {
    return 'maison extra bold'
  }
  else if(fontFamily == 'Maison Neue Extended') {
    return 'maison extended'
  }
  else if(fontFamily == 'Publico') {
    return 'publico bold'
  }
  else if(fontFamily == 'PT Serif') {
    return 'pt serif'
  }
  else {
    return 'none'
  }
}

function applyStyle(layer,newStyle) {
  console.log("apply style")
  console.log(newStyle.import())

  //takes layer and importable (but not yet imported) shared text style
  layer.sharedStyle = newStyle;
  layer.style.fontSize = newStyle.import().style.fontSize;
  layer.style.lineHeight = newStyle.import().style.lineHeight;

  sketch.UI.message('📱 ' + newStyle.name)
}

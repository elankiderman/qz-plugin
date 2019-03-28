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
      if(layer.sharedStyle) {
        //find current style
        console.log("performing operation")

        var styleReferences = library.getImportableTextStyleReferencesForDocument(document);


        var font = getFont(layer);

        var device = getDevice(layer);

        console.log("font: "+ font)
        console.log("device: "+ device)

        device = device.replace("(", "\\(")
        device = device.replace(")", "\\)")


        var regex = new RegExp(font +' /.+/ ' + device)

        var fontDeviceMatches = styleReferences.filter(style => {
          //console.log(style.name)
          return regex.test(style.name);
        })


        console.log("has a text style, going to cycle through")

        var textSizeKey = fontDeviceMatches.sort(compare);

        var currentStyleName = layer.sharedStyle.name;

        console.log("= " + currentStyleName)

        for(var i = 0; i < textSizeKey.length; i++) {
          console.log(textSizeKey[i].name)
          if(textSizeKey[i].name == currentStyleName) {
            console.log("found a match")

            var nextStyle = textSizeKey[(i+1)%textSizeKey.length]

            applyStyle(layer,nextStyle)

          }
        }

      }
      else {
        //find nearest text size
        sketch.UI.message('doesn\'t have a text style')

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

function getDevice(layer) {
  var splitName = layer.sharedStyle.name.split(' / ');

  return(splitName[2])
}

function getFont(layer) {
  var splitName = layer.sharedStyle.name.split(' / ');

  return(splitName[0])
}



function compare(a,b) {
  var aSize = a.import().style.fontSize;

  var bSize = b.import().style.fontSize;
  if (aSize < bSize)
    return -1;
  if (aSize > bSize)
    return 1;
  return 0;
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

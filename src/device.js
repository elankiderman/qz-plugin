import sketch from 'sketch'
const Style = sketch.Style
const symbolMaster = sketch.symbolMaster
const symbolDeviceKey = ['desktop (2000)', 'desktop (1440)', 'tablet', 'mobile'];
const textDeviceKey = ['desktop (1200)', 'desktop (1024)', 'tablet (768)', 'mobile']

const document = sketch.getSelectedDocument();
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  const doc = sketch.getSelectedDocument()
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
    iterateLayers(selectedLayers);
  }
}

function iterateLayers(selectedLayers) {
  selectedLayers.forEach(layer => {
    if (layer.type == 'SymbolInstance') {
      swapSymbol(layer);
    }
    else if(layer.type == 'Text') {
      swapText(layer);
    }
    else {
      sketch.UI.message('not a symbol or text with style')
    }

  })
}

function swapSymbol(layer) {
  var key = symbolDeviceKey;

  var master = layer.master;
  var name = master.name;

  for(var i = 0; i<key.length;i++) {
    var currentDevice = key[i];

    var nextDevice = key[(i+1)%key.length];
    if(name.indexOf(currentDevice) != -1) {
      console.log("currentDevice: " + currentDevice);
      console.log("nextDevice: " + nextDevice);
      var nextName = name.replace(currentDevice, nextDevice)

      var originLibrary = master.getLibrary();
      if(originLibrary) {
        var symbolReferences = originLibrary.getImportableSymbolReferencesForDocument(document);


        var reverseSymbols = symbolReferences.filter(symbol => {
          return symbol.name === nextName;
        })

      var newMaster = reverseSymbols[0].import();

      }
      else {
        var symbolReferences = document.getSymbols();
        var reverseSymbols = symbolReferences.filter(symbol => {
          return symbol.name === nextName;
        })
        var newMaster = reverseSymbols[0];
      }


      layer.master = newMaster;

      console.log(layer.frame.width);

      layer.frame.width = newMaster.frame.width;
      layer.frame.height = newMaster.frame.height;

      sketch.UI.message('📱 ' + nextDevice)


      break;
    }
  }
}

function swapText(layer) {
  var key = textDeviceKey;
  var styleId = layer.sharedStyleId;
  var master = document.getSharedTextStyleWithID(styleId);

  var name = master.name;
  console.log(name);


  for(var i = 0; i<key.length;i++) {
    var currentDevice = key[i];

    var nextDevice = key[(i+1)%key.length];
    if(name.indexOf(currentDevice) != -1) {

      var nextName = name.replace(currentDevice, nextDevice)

      var originLibrary = master.getLibrary();
      if(originLibrary) {
        var styleReferences = originLibrary.getImportableTextStyleReferencesForDocument(document);


        var nextStyles = styleReferences.filter(style => {
          return style.name === nextName;
        })

      var nextStyle = nextStyles[0].import();


      }

      console.log(layer.style)
      console.log(nextStyle)


      layer.sharedStyle = nextStyle;
      layer.style = nextStyle.style;


      sketch.UI.message('📱 ' + nextName)


      break;
    }
  }
}

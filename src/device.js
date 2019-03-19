import sketch from 'sketch'
const Style = sketch.Style
const symbolMaster = sketch.symbolMaster
const deviceKey = ['desktop (2000)', 'desktop (1440)', 'tablet', 'mobile']

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
    if (layer.type == 'SymbolInstance') {
      swapSymbol(layer);
    }
    else {
      sketch.UI.message('not a symbol')
    }

  })
}

function swapSymbol(layer) {
  var master = layer.master;
  var name = master.name;

  for(var i = 0; i<deviceKey.length;i++) {
    var currentDevice = deviceKey[i];

    var nextDevice = deviceKey[(i+1)%deviceKey.length];
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

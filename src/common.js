import sketch from 'sketch'
const Style = sketch.Style
var Library = require('sketch/dom').Library
const symbolMaster = sketch.symbolMaster
const symbolDeviceKey = ['desktop (2000)', 'desktop (1440)', 'tablet', 'mobile'];
const textDeviceKey = ['desktop (1200)', 'desktop (1024)', 'tablet (768)', 'mobile']
const colorKey = {
    '#000000': '#ffffff',
    '#ffffff': '#000000',
    '#333333': '#f9f9f9',
    '#f9f9f9': '#333333',
    '#bebebe': '#777777',
    '#7777777': '#bebebe',
    '#4c4c4c': '#e2e2e2',
    '#e2e2e2': '#4c4c4c'
};


const document = sketch.getSelectedDocument();

var library;

function applyStyle(layer,newStyle) {
  console.log("apply style")
  console.log(newStyle.import())

  //takes layer and importable (but not yet imported) shared text style
  layer.sharedStyle = newStyle;
  layer.style.fontSize = newStyle.import().style.fontSize;
  layer.style.lineHeight = newStyle.import().style.lineHeight;

  sketch.UI.message('📱 ' + newStyle.name)
}

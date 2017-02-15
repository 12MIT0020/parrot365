window.wittyParrotInject = {
  init: function() {
    // console.log("wittyParrotInject");
    window.wittyParrotInject.mapElementWithCss($('*'));
    var evtStr = window.wittyParrotInject.getHTMLOfSelection();
    // console.log("calling background.js"+ evtStr.length);
    if (evtStr.length) {
      chrome.extension.sendMessage({
        'message': 'setText',
        'data': evtStr
      });
    }
  },
  mapElementWithCss: function(selector) {
    var styleNames = ['font-family', 'font-style', 'font-variant', 'font-weight', 'font-stretch']; //list all properties which you want to copy
    selector.each(function() {
      var elm = $(this);
      var styleObj = {};
      var compStyle = window.getComputedStyle(elm[0], null);
      styleNames.forEach(function(style) {
        var propVal = compStyle.getPropertyValue(style);
        if (propVal !== '' && propVal !== ';')
          styleObj[style] = compStyle.getPropertyValue(style);
      });
      elm.css(styleObj);
    });
  },
  getHTMLOfSelection: function() {
    var range;
    if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      //	this.document.execCommand("Copy", true);
      return range.htmlText;
    } else if (window.getSelection) {
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        var clonedSelection = range.cloneContents();
        var div = document.createElement('div');
        div.appendChild(clonedSelection);
        return div.innerHTML;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
};

window.addEventListener("mousedown", function(e) {
  if (e.which === 3) { // right click = 3, left click = 1
    window.wittyParrotInject.init();
  }
});

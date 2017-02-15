var winId='';
chrome.browserAction.onClicked.addListener(function(tab) {
  // debugger;
  if(!winId){
    createPopup();
  }else{
    chrome.windows.update(winId, {'focused':true, 'width':400, 'height': 650, 'left':screen.availWidth - 370, 'top':90}, function(window) {
      if(!window){
        createPopup();
      }
    });
  }
  function createPopup(){
    chrome.windows.create({'url': 'index.html?source=chrome-extension', 'type': 'popup', 'width':400, 'height': 650, 'left':screen.availWidth - 370, 'top':90}, function(window) {
      winId=window.id;
    });
  }
});

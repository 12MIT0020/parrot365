chrome.runtime.onInstalled.addListener(function() {
  // Set up context menu tree at install time.
  console.log("Loaded background.js on install");
  var selectionId, fullpageid;
  var contexts = ["selection"];
  if (!selectionId) {
    selectionId = chrome.contextMenus.create({
      "title": "Clip Selection",
      "contexts": ['selection'],
      "id": "selection"
    });
  } else {
    chrome.contextMenus.update(selectionId, {
      "title": "Clip Selection",
      "contexts": ['selection']
    });
  }

});

chrome.contextMenus.onClicked.addListener(function(info) {

  switch (info.menuItemId) {
    case "selection":
      saveAsText(info);
      break;
    case "fullpage":
      {
        /*var evt  = document.getElementsByTagName("BODY")[0];
        var range = document.createRange();
              range.selectNodeContents(evt);
        var selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              if (selection.rangeCount > 0) {
                  var rangeCount = selection.getRangeAt(0);
                  var clonedSelection = rangeCount.cloneContents();
                  var div = document.createElement('div');
                          div.appendChild(clonedSelection);
                          window.seltext=div.innerHTML;
              }
              //selection.removeAllRanges();*/
        saveAsText(info);
      }
      break;
    default:
      saveAsText(info);
      break;
  }
});

var seltext = null;
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(request.data);
  switch (request.message) {
    case 'setText':
      window.seltext = request.data;
      break;

    default:
      window.seltext = null;
      break;
  }
});

function saveAsText(info) {
  console.log("Clipping process has been initialized");
  if (seltext === null) {
    console.log("Unable to read the selection !");
    alert('Please refresh this page and try again !');
    return;
  } else {
    seltext = "<div style='position: relative;'>" + seltext + "</div>";
    // if (!docCookies.getItem("tokenKey")) {
        if (!docCookies.getItem("p365WidgetKey")) {

      alert("Please Login to WittyParrot extension");
      return;
    } else {
      var baseUrl, eventBaseUrl;
      $.ajax({
        // url: "../config.json", //deleted
        url: "config-helper/config.json",
        type: "GET",
        success: function(response) {
          response = JSON.parse(response);
          for (var i = 0; i < response.apiUrls.length; i++) {
            if (response.apiUrls[i].flag) {
              baseUrl = response.apiUrls[i].url;
              eventBaseUrl = response.apiUrls[i].urlevent;
            }
          }
          var jsonObj = {};
          var title = $.trim($(seltext).text());
          jsonObj.name = title.substr(0, 30).trim();
          jsonObj.content = seltext;
          jsonObj.witType = "ORDINARY";
          jsonObj = JSON.stringify(jsonObj);
          $.ajax({
            url: baseUrl + "/wits",
            type: "POST",
            data: jsonObj,
            beforeSend: function(xhr) {
              console.log("Saving your content.");
              chrome.browserAction.setIcon({
                path: "/resources/assets/images/witty-loading-5.gif"
              });
              xhr.setRequestHeader("Content-Type", "application/json");
            //   xhr.setRequestHeader("Authorization", docCookies.getItem("tokenKey"));
            xhr.setRequestHeader("Authorization", docCookies.getItem("p365WidgetKey"));

            },
            success: function(response) {
              console.log('Got the response');
              chrome.browserAction.setIcon({
                path: "/resources/assets/images/wp_logo_96px.png"
              });
              // console.log(response);
              alert("Clipped to WittyParrot as " + '"' + response.name + '"');
            },
            error: function(error) {
              chrome.browserAction.setIcon({
                path: "/resources/assets/images/wp_logo_96px.png"
              });
              console.log('Got error');
              console.log(error);
              alert("Something went bad. Please try again after a page refresh !");
            }
          });

        },
        error: function(error) {
          console.log(console.error());
        }
      });

    }

  }
}

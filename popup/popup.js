/*
*   Listen for clicks in the popup.
*
*   If the click is not on one of the menu divs, return early.
*
*   Otherwise, the text content of the node is the selected option:
*       Inject the visua11y script into the active tab and
*       send it a message containing the selected option.
*/
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("visua11y")) {
    return;
  }

  var selection = e.target.textContent;

  chrome.tabs.insertCSS(null, {
    file: "/content-scripts/visua11y.css"
  });

  chrome.tabs.executeScript(null, {
    file: "/content-scripts/visua11y.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {selection: selection});
  });

});

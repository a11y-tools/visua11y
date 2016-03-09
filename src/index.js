"use strict";

function visua11y (request, sender, sendResponse) {
  runSelectedApp(request.selection);
  chrome.runtime.onMessage.removeListener(visua11y);
}

function runSelectedApp (selection) {
  let appName = getAppName(selection);
  let initApp = null;

  switch(selection) {
    case 'Forms':
      initApp = initForms;
      break;
    case 'Headings':
      initApp = initHeadings;
      break;
    case 'Images':
      initApp = initImages;
      break;
    case 'Landmarks':
      initApp = initLandmarks;
      break;
    case 'Lists':
      initApp = initLists;
      break;
  }
  if (initApp === null) return;

  if (typeof window[appName] !== 'function')
    window[appName] = initApp();
  window[appName].run();
}

chrome.runtime.onMessage.addListener(visua11y);

'use strict';

function visua11y (request, sender, sendResponse) {
  runSelectedApp(request.selection);
  chrome.runtime.onMessage.removeListener(visua11y);
}

function runSelectedApp (selection) {
  let globalName = getGlobalName(selection);
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

  if (typeof window[globalName] !== 'object')
    window[globalName] = initApp();
  window[globalName].run();
}

chrome.runtime.onMessage.addListener(visua11y);

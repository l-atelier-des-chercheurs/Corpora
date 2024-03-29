if (window.state.is_electron) {
  document.body.addEventListener("click", electronSpecificOpenLink);

  // If click on a link with a specific class, open in the browser and not in electron.
  function electronSpecificOpenLink(event) {
    event.path.every((item) => {
      if (item.classList !== undefined && item.classList.length > 0) {
        if (item.classList.contains("js--openInBrowser")) {
          event.preventDefault();
          window.electronAPI.send("toMain", {
            type: "open_external",
            url: item.href,
          });
          return false;
        } else if (item.classList.contains("js--openInNativeApp")) {
          event.preventDefault();
          window.electronAPI.send("toMain", {
            type: "open_item",
            path: item.href,
          });
          return false;
        }
      }
      return true;
    });
  }
}

document.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
    return false;
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    event.preventDefault();
    return false;
  },
  false
);

import app from "./vue/app.js";

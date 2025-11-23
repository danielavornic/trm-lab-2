const debugLog = document.getElementById("debugLog");

function log(msg) {
  debugLog.textContent = msg;
  console.log(msg);
}

log("Scripts loaded");

// Wait for scene to be ready, then hide loading screen
window.addEventListener("load", () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
    log("AR Ready");
  }, 2000);
});

// Wire up marker detection to tap area (AR.js recommended approach)
let activeFragment = null;

setTimeout(() => {
  const markers = document.querySelectorAll("a-nft");
  const tapArea = document.getElementById("arTapArea");

  log(`Tracking ${markers.length} markers`);

  markers.forEach((marker) => {
    marker.addEventListener("markerFound", () => {
      let markerId = marker.getAttribute("data-marker-id");
      if (!markerId) {
        const trackerAttr = marker.getAttribute("marker-tracker");
        markerId = trackerAttr ? trackerAttr.split(":")[1]?.trim() : "unknown";
      }

      // Find the fragment component
      const fragment = marker.querySelector("[fragment-collector]");
      if (fragment) {
        const component = fragment.components["fragment-collector"];
        activeFragment = component;
        tapArea.style.display = "block";
        log(`✓ ${markerId} - Tap to collect`);
      }
    });

    marker.addEventListener("markerLost", () => {
      let markerId = marker.getAttribute("data-marker-id");
      if (!markerId) {
        const trackerAttr = marker.getAttribute("marker-tracker");
        markerId = trackerAttr ? trackerAttr.split(":")[1]?.trim() : "unknown";
      }

      activeFragment = null;
      tapArea.style.display = "none";
      log(`✗ ${markerId} lost`);
    });
  });

  // Handle taps on the overlay - AR.js recommended pattern
  tapArea.addEventListener("click", () => {
    if (activeFragment && !activeFragment.collected) {
      log(`Collecting ${activeFragment.data.fragmentId}`);
      activeFragment.collect();
    }
  });
}, 2500);

// Listen for game state updates
window.addEventListener("gamestateupdate", (e) => {
  const collected = e.detail.collected.length;
  log(`Progress: ${collected}/6 fragments`);
});

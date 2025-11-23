const debugLog = document.getElementById("debugLog");

function log(msg) {
  debugLog.textContent = msg;
  console.log(msg);
}

log("Scripts loaded");

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
  const overlayText = document.getElementById("arOverlayText");

  log(`Tracking ${markers.length} markers`);

  markers.forEach((marker) => {
    marker.addEventListener("markerFound", () => {
      let markerId = marker.getAttribute("data-marker-id");
      if (!markerId) {
        const trackerAttr = marker.getAttribute("marker-tracker");
        markerId = trackerAttr ? trackerAttr.split(":")[1]?.trim() : "unknown";
      }

      const fragment = marker.querySelector("[fragment-collector]");
      if (fragment) {
        const component = fragment.components["fragment-collector"];
        activeFragment = component;

        if (component.collected) {
          log(`✓ ${markerId} - Already collected`);
          tapArea.style.display = "none";
          overlayText.style.display = "none";
        } else if (!GameState.canShow(markerId)) {
          log(`✓ ${markerId} - Locked (collect prerequisites first)`);
          tapArea.style.display = "none";
          overlayText.style.display = "block";
          overlayText.textContent = "LOCKED";
          overlayText.style.color = "#ff6b6b"; // Red for locked
        } else {
          log(`✓ ${markerId} - Tap to collect`);
          tapArea.style.display = "block";
          overlayText.style.display = "block";
          overlayText.textContent = "UNLOCK";
          overlayText.style.color = "gold"; // Gold for unlock
        }
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
      overlayText.style.display = "none";
      log(`✗ ${markerId} lost`);
    });
  });

  // Handle taps on the overlay - AR.js recommended pattern
  tapArea.addEventListener("click", () => {
    if (activeFragment && !activeFragment.collected) {
      const fragmentId = activeFragment.data.fragmentId;

      if (GameState.canShow(fragmentId)) {
        log(`Collecting ${fragmentId}...`);
        activeFragment.collect();

        setTimeout(() => {
          tapArea.style.display = "none";
          overlayText.style.display = "none";
          log(`✓ ${fragmentId} - Collected!`);
        }, 100);
      } else {
        log("Locked - collect prerequisites first");
      }
    }
  });
}, 2500);

// Listen for game state updates
window.addEventListener("gamestateupdate", (e) => {
  const collected = e.detail.collected.length;
  log(`Progress: ${collected}/6 fragments`);
});

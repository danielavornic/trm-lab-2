document.addEventListener('DOMContentLoaded', () => {
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const fragmentsDisplay = document.getElementById('fragmentsDisplay');
  const notification = document.getElementById('notification');
  const narrativePanel = document.getElementById('narrativePanel');
  const narrativeText = document.getElementById('narrativeText');
  const closeNarrative = document.getElementById('closeNarrative');
  const loadingScreen = document.getElementById('loadingScreen');

  let notificationTimer = null;

  function updateProgress() {
    const progress = GameState.getProgress();
    progressText.textContent = `${progress.collected}/${progress.total} Fragments`;
    progressFill.style.width = `${progress.percentage}%`;

    GameState.state.collected.forEach(fragmentId => {
      const icon = fragmentsDisplay.querySelector(`[data-fragment="${fragmentId}"]`);
      if (icon && !icon.classList.contains('collected')) {
        icon.classList.add('collected');
      }
    });

    if (progress.collected === progress.total) {
      setTimeout(() => {
        showNotification('All fragments collected! The memory is complete.');
      }, 500);
    }
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }
    
    notificationTimer = setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  function showNarrative(text) {
    narrativeText.textContent = text;
    narrativePanel.classList.add('show');
  }

  function hideNarrative() {
    narrativePanel.classList.remove('show');
  }

  closeNarrative.addEventListener('click', hideNarrative);

  window.addEventListener('gamestateupdate', (e) => {
    updateProgress();
  });

  window.addEventListener('shownotification', (e) => {
    showNotification(e.detail.message);
  });

  window.addEventListener('shownarrative', (e) => {
    showNarrative(e.detail.text);
  });

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000);

  updateProgress();
});


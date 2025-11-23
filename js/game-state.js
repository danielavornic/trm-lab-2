const GameState = {
  STORAGE_KEY: "ar-memory-fragments-state",

  dependencies: {
    journal: [],
    toy: ["journal"],
    photo: ["toy"],
    letter: ["toy"],
    "music-box": ["photo"],
    key: ["letter"],
  },

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.reset();
      }
    } else {
      this.reset();
    }
  },

  reset() {
    this.state = {
      scanned: [],
      collected: [],
      currentPath: null,
    };
    this.save();
    this.emitUpdate();
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  markScanned(markerId) {
    if (!this.state.scanned.includes(markerId)) {
      this.state.scanned.push(markerId);
      this.save();
      this.emitUpdate();
    }
  },

  markCollected(markerId) {
    if (!this.state.collected.includes(markerId)) {
      this.state.collected.push(markerId);

      if (markerId === "toy" && !this.state.currentPath) {
        this.state.currentPath = "undecided";
      } else if (
        markerId === "photo" &&
        this.state.currentPath === "undecided"
      ) {
        this.state.currentPath = "photo";
      } else if (
        markerId === "letter" &&
        this.state.currentPath === "undecided"
      ) {
        this.state.currentPath = "letter";
      }

      this.save();
      this.emitUpdate();
    }
  },

  canShow(markerId) {
    const deps = this.dependencies[markerId];
    if (!deps || deps.length === 0) return true;

    if (markerId === "photo" || markerId === "letter") {
      return this.state.collected.includes("toy");
    }

    return deps.every((dep) => this.state.collected.includes(dep));
  },

  isScanned(markerId) {
    return this.state.scanned.includes(markerId);
  },

  isCollected(markerId) {
    return this.state.collected.includes(markerId);
  },

  getProgress() {
    const total = Object.keys(this.dependencies).length;
    const collected = this.state.collected.length;
    return { collected, total, percentage: (collected / total) * 100 };
  },

  emitUpdate() {
    window.dispatchEvent(
      new CustomEvent("gamestateupdate", {
        detail: {
          scanned: [...this.state.scanned],
          collected: [...this.state.collected],
          progress: this.getProgress(),
        },
      })
    );
  },
};

GameState.init();

AFRAME.registerComponent("fragment-collector", {
  schema: {
    fragmentId: { type: "string", default: "" },
    narrativeText: { type: "string", default: "" },
  },

  init() {
    this.collected = false;
    this.el.classList.add("interactive");
    this.collect = this.collect.bind(this);
  },

  collect() {
    console.log("Click detected on fragment:", this.data.fragmentId);

    if (this.collected) {
      console.log("Already collected");
      return;
    }

    const fragmentId = this.data.fragmentId;
    if (!GameState.canShow(fragmentId)) {
      console.log("Cannot show this fragment yet");
      return;
    }

    console.log("Collecting fragment:", fragmentId);
    this.collected = true;
    GameState.markCollected(fragmentId);

    this.el.setAttribute("animation__collect", {
      property: "scale",
      to: "1.5 1.5 1.5",
      dur: 300,
      easing: "easeOutQuad",
    });

    setTimeout(() => {
      this.el.setAttribute("animation__shrink", {
        property: "scale",
        to: "1 1 1",
        dur: 200,
        easing: "easeInQuad",
      });
    }, 300);

    this.showNotification(`Fragment collected: ${fragmentId}`);
  },

  showNotification(message) {
    window.dispatchEvent(
      new CustomEvent("shownotification", {
        detail: { message },
      })
    );
  },

  showNarrative(text) {
    window.dispatchEvent(
      new CustomEvent("shownarrative", {
        detail: { text },
      })
    );
  },
});

AFRAME.registerComponent("marker-tracker", {
  schema: {
    markerId: { type: "string", default: "" },
  },

  init() {
    this.markerFound = this.markerFound.bind(this);
    this.markerLost = this.markerLost.bind(this);

    this.el.addEventListener("markerFound", this.markerFound);
    this.el.addEventListener("markerLost", this.markerLost);
  },

  markerFound() {
    const markerId = this.data.markerId;
    GameState.markScanned(markerId);

    if (!GameState.canShow(markerId)) {
      this.hideContent();
    } else {
      this.showContent();
    }
  },

  markerLost() {},

  showContent() {
    const content = this.el.querySelector("[fragment-collector]");
    if (content) {
      content.setAttribute("visible", "true");
    }
  },

  hideContent() {
    const content = this.el.querySelector("[fragment-collector]");
    if (content) {
      content.setAttribute("visible", "false");
    }
  },
});

AFRAME.registerComponent("unlock-trigger", {
  schema: {
    requiredFragments: { type: "array", default: [] },
  },

  init() {
    this.checkVisibility = this.checkVisibility.bind(this);
    this.checkVisibility();

    window.addEventListener("gamestateupdate", this.checkVisibility);
  },

  checkVisibility() {
    const required = this.data.requiredFragments;
    const canShow =
      required.length === 0 ||
      required.every((id) => GameState.isCollected(id));

    this.el.setAttribute("visible", canShow);
  },

  remove() {
    window.removeEventListener("gamestateupdate", this.checkVisibility);
  },
});

AFRAME.registerComponent("pulse-animation", {
  schema: {
    speed: { type: "number", default: 2000 },
  },

  init() {
    this.el.setAttribute("animation__pulse", {
      property: "scale",
      from: "1 1 1",
      to: "1.1 1.1 1.1",
      dur: this.data.speed,
      dir: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
  },
});

AFRAME.registerComponent("rotate-slow", {
  schema: {
    speed: { type: "number", default: 10000 },
  },

  init() {
    this.el.setAttribute("animation__rotate", {
      property: "rotation",
      to: "0 360 0",
      dur: this.data.speed,
      loop: true,
      easing: "linear",
    });
  },
});

AFRAME.registerComponent("particle-emitter", {
  schema: {
    count: { type: "number", default: 20 },
    color: { type: "color", default: "#ffffff" },
  },

  init() {
    this.particles = [];
    this.createParticles();
  },

  createParticles() {
    for (let i = 0; i < this.data.count; i++) {
      const particle = document.createElement("a-sphere");
      particle.setAttribute("radius", "0.02");
      particle.setAttribute("material", {
        color: this.data.color,
        emissive: this.data.color,
        emissiveIntensity: 0.8,
        opacity: 0.8,
        transparent: true,
      });

      const angle = (Math.PI * 2 * i) / this.data.count;
      const radius = 0.3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.2;

      particle.setAttribute("position", `${x} ${y} ${z}`);

      particle.setAttribute("animation__float", {
        property: "position",
        to: `${x * 1.5} ${y + 0.5} ${z * 1.5}`,
        dur: 2000,
        delay: i * 50,
        easing: "easeOutQuad",
      });

      particle.setAttribute("animation__fade", {
        property: "components.material.material.opacity",
        from: 0.8,
        to: 0,
        dur: 2000,
        delay: i * 50,
      });

      this.el.appendChild(particle);
      this.particles.push(particle);
    }

    setTimeout(() => {
      this.particles.forEach((p) => p.parentNode.removeChild(p));
      this.particles = [];
    }, 2500);
  },
});

AFRAME.registerComponent("glow-ring", {
  schema: {
    color: { type: "color", default: "#667eea" },
  },

  init() {
    const ring = document.createElement("a-ring");
    ring.setAttribute("radius-inner", "0.3");
    ring.setAttribute("radius-outer", "0.35");
    ring.setAttribute("material", {
      color: this.data.color,
      emissive: this.data.color,
      emissiveIntensity: 1,
      opacity: 0.6,
      transparent: true,
      side: "double",
    });
    ring.setAttribute("rotation", "-90 0 0");
    ring.setAttribute("position", "0 -0.1 0");

    ring.setAttribute("animation__scale", {
      property: "scale",
      from: "0.5 0.5 0.5",
      to: "1.5 1.5 1.5",
      dur: 1500,
      loop: true,
      easing: "easeInOutQuad",
    });

    ring.setAttribute("animation__fade", {
      property: "components.material.material.opacity",
      from: 0.6,
      to: 0,
      dur: 1500,
      loop: true,
      easing: "easeInOutQuad",
    });

    this.el.appendChild(ring);
  },
});

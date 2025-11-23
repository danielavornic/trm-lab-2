# Memory Fragments - AR Experience

An augmented reality narrative experience built with AR.js. Players scan physical markers to unlock and collect memory fragments, revealing a story about reconstructing forgotten memories.

**Deployed at**: https://trm-memory-fragments.vercel.app

## The Narrative

The experience follows a branching story where players discover memory fragments in sequence:

1. **Journal** → _"A locked journal. The first memory begins here..."_

   - Always available as the starting point

2. **Toy** → _"A worn childhood toy. It smells like distant summers..."_

   - Unlocked after collecting the journal

3. **Branching Path** (player chooses one):
   - **Photo** → _"A faded photograph, frozen in time..."_
     - Leads to **Music Box** → _"A delicate music box. Its melody echoes a happy ending..."_
   - **Letter** → _"An unopened letter. Some words are better left unsaid..."_
     - Leads to **Key** → _"An old key. Some doors are meant to stay locked..."_

Two endings emerge from the player's choice at the branch point, creating a personalized narrative journey.

## Assignment Requirements

### Steps

1. Clone the git repository
2. Create your own repository
3. Make your own NFT markers
4. Find your own 3D objects or text panels
5. Link hosting with your git repository
6. Add narrative text

### Grading Criteria

- **5 points**: Shows only one object when scanning the scene
- **7 points**: Switch from one object to another, with the condition that the first one has been scanned before the second (the second object cannot appear until the first one is scanned)
- **9 points**: Multiple scenarios with interaction
- **10 points**: Artistic and narrative value

This project meets the **10-point requirement** with sequential unlocking, branching paths, multiple interactive scenarios, and a cohesive narrative structure.

## NFT Marker Creation

The NFT markers were created using the [NFT Marker Creator](https://carnaux.github.io/NFT-Marker-Creator/#/). Each marker starts with a unique 1024x1024px high-contrast image, which is processed to generate the required marker files (.fset, .fset3, .iset). These files are placed in their respective `markers/{name}/` directories.

## 3D Objects

The 3D objects for each memory fragment were created using A-Frame primitives (built-in geometric shapes) rather than imported models. Each fragment uses a unique combination of primitives:

- **Journal**: Octahedron (crystal/diamond shape)
- **Toy**: Sphere
- **Photo**: Torus (ring shape)
- **Music Box**: Box primitives
- **Letter**: Cylinder (wax seal)
- **Key**: Multiple box primitives combined to create a custom key shape

Each object features custom materials with metalness/roughness properties, and colors that match the narrative theme.

## Project Structure

```
├── markers/              # NFT marker files (.fset, .fset3, .iset)
│   ├── journal/
│   ├── toy/
│   ├── photo/
│   ├── letter/
│   ├── key/
│   └── music-box/
├── models/              # 3D models
├── js/
│   ├── game-state.js   # State management with localStorage
│   ├── components.js   # A-Frame components
│   └── ui.js          # UI handlers
├── css/
│   └── style.css
└── index.html         # Main AR scene
```

## Features

- Sequential unlocking with dependency tracking
- Branching narrative paths with player choice
- Interactive fragment collection (tap to collect)
- Progress persistence via localStorage
- Visual feedback with animations and glow effects

## Technologies

- A-Frame (1.4.0) - WebVR framework
- AR.js - Marker-based AR
- Vanilla JavaScript - Game logic
- LocalStorage - Progress saving

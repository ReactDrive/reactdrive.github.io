window.REACTDRIVE_EXAMPLES = [
  {
    "id": "shift-right",
    "title": "Turn right · residential",
    "action": "Turn right",
    "dataset": "Waymo",
    "description": "Same scene. Both models are asked to turn right.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/shift-right-reactdrive.mp4",
      "poster": "assets/posters/shift-right-reactdrive.jpg",
      "sequence": "assets/posters/shift-right-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/shift-right-cosmos3.mp4",
      "poster": "assets/posters/shift-right-cosmos3.jpg",
      "sequence": "assets/posters/shift-right-cosmos3-sequence.jpg",
      "identityVerified": true
    },
    "sourceId": "P0107"
  },
  {
    "id": "turn-left",
    "title": "Turn left · junction",
    "action": "Turn left",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to turn left.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/turn-left-reactdrive.mp4",
      "poster": "assets/posters/turn-left-reactdrive.jpg",
      "sequence": "assets/posters/turn-left-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/turn-left-cosmos3.mp4",
      "poster": "assets/posters/turn-left-cosmos3.jpg",
      "sequence": "assets/posters/turn-left-cosmos3-sequence.jpg",
      "identityVerified": true
    },
    "sourceId": "P0026"
  },
  {
    "id": "waymo-right-intersection",
    "sourceId": "P0108",
    "title": "Turn right · intersection",
    "action": "Turn right",
    "dataset": "Waymo",
    "description": "Same scene. Both models are asked to turn right.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0108-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0108-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0108-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0108-baseline.mp4",
      "poster": "assets/posters/comparisons/P0108-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0108-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "nuplan-left-intersection",
    "sourceId": "P0025",
    "title": "Turn left · intersection",
    "action": "Turn left",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to turn left.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0025-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0025-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0025-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0025-baseline.mp4",
      "poster": "assets/posters/comparisons/P0025-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0025-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "nuplan-accelerate-boulevard",
    "sourceId": "P0022",
    "title": "Accelerate · boulevard",
    "action": "Accelerate",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to accelerate.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0022-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0022-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0022-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0022-baseline.mp4",
      "poster": "assets/posters/comparisons/P0022-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0022-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "nuplan-decelerate-city",
    "sourceId": "P0023",
    "title": "Slow down · city",
    "action": "Slow down",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to slow down.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0023-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0023-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0023-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0023-baseline.mp4",
      "poster": "assets/posters/comparisons/P0023-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0023-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "nuplan-stop-driveway",
    "sourceId": "P0030",
    "title": "Stop · driveway",
    "action": "Stop",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to stop.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0030-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0030-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0030-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0030-baseline.mp4",
      "poster": "assets/posters/comparisons/P0030-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0030-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "waymo-stop-street",
    "sourceId": "P0110",
    "title": "Stop · city street",
    "action": "Stop",
    "dataset": "Waymo",
    "description": "Same scene. Both models are asked to stop.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0110-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0110-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0110-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0110-baseline.mp4",
      "poster": "assets/posters/comparisons/P0110-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0110-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "nuplan-decelerate-boulevard",
    "sourceId": "P0024",
    "title": "Slow down · boulevard",
    "action": "Slow down",
    "dataset": "nuPlan",
    "description": "Same scene. Both models are asked to slow down.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0024-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0024-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0024-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0024-baseline.mp4",
      "poster": "assets/posters/comparisons/P0024-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0024-baseline-sequence.jpg",
      "identityVerified": false
    }
  },
  {
    "id": "waymo-accelerate-residential",
    "sourceId": "P0102",
    "title": "Accelerate · residential",
    "action": "Accelerate",
    "dataset": "Waymo",
    "description": "Same scene. Both models are asked to accelerate.",
    "duration": 6.1,
    "ours": {
      "name": "ReactDrive",
      "video": "assets/video/comparisons/P0102-reactdrive.mp4",
      "poster": "assets/posters/comparisons/P0102-reactdrive.jpg",
      "sequence": "assets/posters/comparisons/P0102-reactdrive-sequence.jpg"
    },
    "baseline": {
      "name": "Cosmos3",
      "video": "assets/video/comparisons/P0102-baseline.mp4",
      "poster": "assets/posters/comparisons/P0102-baseline.jpg",
      "sequence": "assets/posters/comparisons/P0102-baseline-sequence.jpg",
      "identityVerified": false
    }
  }
];

window.REACTDRIVE_EXTRA = {
  "planningDeltas": [
    {
      "key": "nc",
      "label": "NC",
      "name": "No-at-fault collision",
      "realData": 97.8,
      "cosmos3": 97.8,
      "reactdrive": 98.4,
      "deltaVsReal": 0.6,
      "deltaVsCosmos3": 0.6,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": 0.0
    },
    {
      "key": "dac",
      "label": "DAC",
      "name": "Drivable-area compliance",
      "realData": 93.0,
      "cosmos3": 93.0,
      "reactdrive": 93.8,
      "deltaVsReal": 0.8,
      "deltaVsCosmos3": 0.8,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": 0.0
    },
    {
      "key": "ttc",
      "label": "TTC",
      "name": "Time-to-collision compliance",
      "realData": 93.8,
      "cosmos3": 93.4,
      "reactdrive": 94.4,
      "deltaVsReal": 0.6,
      "deltaVsCosmos3": 1.0,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": -0.4
    },
    {
      "key": "ep",
      "label": "EP",
      "name": "Ego progress",
      "realData": 77.8,
      "cosmos3": 77.9,
      "reactdrive": 78.7,
      "deltaVsReal": 0.9,
      "deltaVsCosmos3": 0.8,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": 0.1
    },
    {
      "key": "comfort",
      "label": "Comfort",
      "name": "Dynamic comfort",
      "realData": 100.0,
      "cosmos3": 100.0,
      "reactdrive": 100.0,
      "deltaVsReal": 0.0,
      "deltaVsCosmos3": 0.0,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": 0.0
    },
    {
      "key": "ddc",
      "label": "DDC",
      "name": "Driving-direction compliance",
      "realData": 98.3,
      "cosmos3": 98.3,
      "reactdrive": 98.4,
      "deltaVsReal": 0.1,
      "deltaVsCosmos3": 0.1,
      "deltaUnit": "percentage points",
      "absoluteUnit": "%",
      "cosmos3DeltaVsReal": 0.0
    },
    {
      "key": "pdms",
      "label": "PDMS",
      "name": "Predictive Driver Model Score",
      "realData": 83.8,
      "cosmos3": 83.8,
      "reactdrive": 85.1,
      "deltaVsReal": 1.3,
      "deltaVsCosmos3": 1.3,
      "deltaUnit": "score points",
      "absoluteUnit": "score / 100",
      "cosmos3DeltaVsReal": 0.0
    }
  ],
  "ablationCounterfactual": {
    "overall": {
      "egoADE": [
        2.19,
        7.01,
        1.86
      ],
      "egoFDE": [
        4.11,
        3.68,
        3.49
      ],
      "cr": [
        0.45,
        0.33,
        0.26
      ]
    },
    "laneChange": {
      "egoADE": [
        3.39,
        8.48,
        2.93
      ],
      "egoFDE": [
        6.08,
        5.67,
        5.24
      ],
      "cr": [
        0.9,
        0.55,
        0.48
      ]
    },
    "accelerationDeceleration": {
      "egoADE": [
        1.48,
        7.11,
        1.33
      ],
      "egoFDE": [
        3.19,
        2.91,
        2.9
      ],
      "cr": [
        0.2,
        0.23,
        0.16
      ]
    },
    "stop": {
      "egoADE": [
        1.21,
        3.85,
        0.79
      ],
      "egoFDE": [
        2.0,
        1.22,
        1.19
      ],
      "cr": [
        0.07,
        0.07,
        0
      ]
    }
  },
  "ablationFactual": {
    "fid": [
      23.47,
      23.57,
      23.64
    ],
    "fvd": [
      7.42,
      7.33,
      7.3
    ],
    "agentADE": [
      1.14,
      1.07,
      1.03
    ],
    "agentFDE": [
      2.27,
      3.02,
      2.2
    ]
  },
  "ablationMethods": [
    "Without dynamics prior",
    "Without position",
    "ReactDrive"
  ]
};

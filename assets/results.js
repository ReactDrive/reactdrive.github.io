// Values transcribed and checked against the supplied ReactDrive manuscript.
window.REACTDRIVE_RESULTS = {
  "methods": [
    "Vista",
    "GEM",
    "Epona",
    "DrivingWorld",
    "Cosmos3",
    "ReactDrive"
  ],
  "metrics": {
    "fid": {
      "label": "FID",
      "name": "Fréchet Inception Distance",
      "direction": "lower",
      "unit": "",
      "definition": "Image quality compared with recorded futures."
    },
    "fvd": {
      "label": "FVD",
      "name": "Fréchet Video Distance",
      "direction": "lower",
      "unit": "",
      "definition": "Video quality compared with recorded futures."
    },
    "agentADE": {
      "label": "Agent ADE",
      "name": "Agent average displacement error",
      "direction": "lower",
      "unit": "normalized",
      "definition": "Bounding-box center displacement between matched generated and recorded vehicle tracks, normalized by anchor-frame box height and averaged across commonly detected frames."
    },
    "agentFDE": {
      "label": "Agent FDE",
      "name": "Agent final displacement error",
      "direction": "lower",
      "unit": "normalized",
      "definition": "Normalized bounding-box center displacement at each matched track’s final commonly detected frame."
    },
    "egoADE": {
      "label": "Ego ADE",
      "name": "Ego average displacement error",
      "direction": "lower",
      "unit": "",
      "definition": "Average displacement between the ego trajectory recovered from generated video and the requested path."
    },
    "egoFDE": {
      "label": "Ego FDE",
      "name": "Ego final displacement error",
      "direction": "lower",
      "unit": "",
      "definition": "Final displacement between the ego trajectory recovered from generated video and the requested path."
    },
    "cr": {
      "label": "Collision rate",
      "paperLabel": "CR",
      "name": "Collision Rate",
      "direction": "lower",
      "unit": "%",
      "definition": "Collision Rate (CR) in generated driving videos."
    }
  },
  "protocol": {
    "datasets": [
      "Waymo",
      "nuPlan"
    ],
    "clipsPerDataset": 100,
    "observedFrames": 13,
    "generatedFrames": 48,
    "fps": 10,
    "counterfactualQueriesPerClip": 5,
    "counterfactualRolloutsPerModelAndDataset": 500,
    "queries": [
      "Left lane change",
      "Right lane change",
      "Acceleration",
      "Deceleration",
      "Stop"
    ],
    "counterfactualAggregation": "Equal weight for each of the five maneuvers."
  },
  "datasets": {
    "Waymo": {
      "factual": {
        "fid": [
          47.53,
          24.55,
          30.71,
          29.31,
          23.11,
          23.64
        ],
        "fvd": [
          42.78,
          12.99,
          15.38,
          13.67,
          9.91,
          7.3
        ],
        "agentADE": [
          2.09,
          1.58,
          1.88,
          1.6,
          1.14,
          1.03
        ],
        "agentFDE": [
          5.23,
          4.08,
          5.72,
          4.2,
          2.58,
          2.2
        ]
      },
      "counterfactual": {
        "overall": {
          "egoADE": [
            21.78,
            10.32,
            12.17,
            10.59,
            2.37,
            1.86
          ],
          "egoFDE": [
            40.07,
            21.14,
            20.49,
            21.15,
            4.64,
            3.49
          ],
          "cr": [
            2.14,
            0.87,
            3.06,
            1.89,
            0.47,
            0.26
          ]
        },
        "laneChange": {
          "egoADE": [
            24.72,
            15.18,
            17.75,
            13.1,
            3.38,
            2.93
          ],
          "egoFDE": [
            46.96,
            29.53,
            27.22,
            26.58,
            6.16,
            5.24
          ],
          "cr": [
            1.59,
            1.07,
            4.18,
            2.49,
            0.62,
            0.48
          ]
        },
        "accelerationDeceleration": {
          "egoADE": [
            24.73,
            7.03,
            7.06,
            11.9,
            2.11,
            1.33
          ],
          "egoFDE": [
            47.38,
            13.74,
            11.79,
            24.42,
            4.84,
            2.9
          ],
          "cr": [
            2.23,
            0.52,
            2.78,
            1.67,
            0.52,
            0.16
          ]
        },
        "stop": {
          "egoADE": [
            9.98,
            7.18,
            11.23,
            2.97,
            0.86,
            0.79
          ],
          "egoFDE": [
            11.67,
            19.17,
            24.41,
            3.73,
            1.2,
            1.19
          ],
          "cr": [
            3.06,
            1.18,
            1.39,
            1.11,
            0.07,
            0.0
          ]
        }
      }
    },
    "nuPlan": {
      "factual": {
        "fid": [
          39.78,
          30.13,
          33.58,
          47.16,
          20.54,
          21.82
        ],
        "fvd": [
          48.66,
          14.3,
          9.64,
          23.54,
          8.66,
          6.93
        ],
        "agentADE": [
          1.47,
          1.39,
          1.47,
          2.07,
          0.98,
          0.73
        ],
        "agentFDE": [
          2.48,
          2.23,
          4.43,
          4.6,
          1.48,
          1.22
        ]
      },
      "counterfactual": {
        "overall": {
          "egoADE": [
            18.61,
            7.11,
            8.38,
            12.06,
            2.78,
            2.21
          ],
          "egoFDE": [
            34.76,
            14.13,
            16.29,
            23.92,
            5.29,
            3.91
          ],
          "cr": [
            0.63,
            0.41,
            3.1,
            1.2,
            0.53,
            0.09
          ]
        },
        "laneChange": {
          "egoADE": [
            21.07,
            7.88,
            8.55,
            13.56,
            3.46,
            3.21
          ],
          "egoFDE": [
            40.78,
            14.08,
            15.1,
            28.47,
            6.18,
            5.22
          ],
          "cr": [
            0.39,
            0.72,
            4.51,
            1.22,
            0.23,
            0.2
          ]
        },
        "accelerationDeceleration": {
          "egoADE": [
            21.28,
            6.64,
            7.06,
            14.08,
            2.73,
            1.98
          ],
          "egoFDE": [
            41.4,
            12.37,
            13.56,
            28.37,
            6.01,
            4.13
          ],
          "cr": [
            0.91,
            0.19,
            1.81,
            1.06,
            0.38,
            0.03
          ]
        },
        "stop": {
          "egoADE": [
            8.36,
            6.49,
            10.67,
            5.04,
            1.51,
            0.66
          ],
          "egoFDE": [
            9.45,
            17.76,
            24.13,
            5.94,
            2.06,
            0.84
          ],
          "cr": [
            0.56,
            0.25,
            2.88,
            1.44,
            1.44,
            0.0
          ]
        }
      }
    }
  },
  "planning": {
    "dataset": "NAVSIM",
    "planner": "TransFuser",
    "methods": [
      "Real data",
      "+ Cosmos3",
      "+ ReactDrive"
    ],
    "augmentation": "The two generated-data settings use equal sample counts and the same planner training protocol.",
    "metrics": {
      "nc": {
        "label": "NC",
        "name": "No-at-fault collision",
        "values": [
          97.8,
          97.8,
          98.4
        ],
        "unit": "%",
        "direction": "higher"
      },
      "dac": {
        "label": "DAC",
        "name": "Drivable-area compliance",
        "values": [
          93.0,
          93.0,
          93.8
        ],
        "unit": "%",
        "direction": "higher"
      },
      "ttc": {
        "label": "TTC",
        "name": "Time-to-collision compliance",
        "values": [
          93.8,
          93.4,
          94.4
        ],
        "unit": "%",
        "direction": "higher"
      },
      "ep": {
        "label": "EP",
        "name": "Ego progress",
        "values": [
          77.8,
          77.9,
          78.7
        ],
        "unit": "%",
        "direction": "higher"
      },
      "comfort": {
        "label": "Comfort",
        "name": "Dynamic comfort",
        "values": [
          100.0,
          100.0,
          100.0
        ],
        "unit": "%",
        "direction": "higher"
      },
      "ddc": {
        "label": "DDC",
        "name": "Driving-direction compliance",
        "values": [
          98.3,
          98.3,
          98.4
        ],
        "unit": "%",
        "direction": "higher"
      },
      "pdms": {
        "label": "PDMS",
        "name": "Predictive Driver Model Score",
        "values": [
          83.8,
          83.8,
          85.1
        ],
        "unit": "score / 100",
        "direction": "higher"
      }
    }
  },
  "human": {
    "raters": 34,
    "cases": 50,
    "completedComparisonsPerCriterion": 623,
    "assignedComparisons": 680,
    "baselineCount": 5,
    "protocol": "Blind comparisons of the same scene and driving action. Video positions were randomized; completed judgments were pooled across five baselines.",
    "criteria": [
      {
        "label": "Agent reactivity",
        "reactdriveCount": 598,
        "baselineCount": 25,
        "reactdrivePercent": 96.0,
        "baselinePercent": 4.0
      },
      {
        "label": "Ego controllability",
        "reactdriveCount": 540,
        "baselineCount": 83,
        "reactdrivePercent": 86.7,
        "baselinePercent": 13.3
      },
      {
        "label": "Visual quality",
        "reactdriveCount": 572,
        "baselineCount": 51,
        "reactdrivePercent": 91.8,
        "baselinePercent": 8.2
      },
      {
        "label": "Overall preference",
        "reactdriveCount": 611,
        "baselineCount": 12,
        "reactdrivePercent": 98.1,
        "baselinePercent": 1.9
      }
    ]
  },
  "ablation": {
    "dataset": "Waymo",
    "methods": [
      "Without dynamics prior",
      "Without position",
      "ReactDrive"
    ],
    "metrics": {
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
      ],
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
    "description": "The prior ablation removes the dynamics module and its response tokens. The position ablation removes position information from this module."
  },
  "notes": [
    "Agent path errors are evaluated only where recorded future paths are available.",
    "Agent ADE/FDE use normalized image-space tracks, not physical distances in meters.",
    "Collision Rate is evaluated in generated driving videos.",
    "Human preference rates pool completed judgments across five baselines and are not per-baseline win rates.",
    "Planning compares complete generators at matched augmentation counts; it does not isolate the causal contribution of reactivity.",
    "All values are reported point estimates from the supplied manuscript; no confidence intervals are supplied."
  ]
};

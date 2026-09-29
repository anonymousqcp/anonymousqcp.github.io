"use strict";
// Simulation: matched rollout measurements. Real robot: aggregate evaluation results.
window.QCP_COMPARISONS = [
  {
    "id": "transport",
    "title": "Carry with a steadier hand",
    "task": "Wine-glass transport",
    "quality": "Stability",
    "base": "assets/media/transport-base.mp4",
    "ours": "assets/media/transport-qcp.mp4",
    "basePoster": "assets/media/transport-base.jpg",
    "oursPoster": "assets/media/transport-qcp.jpg",
    "metric": "Mean tilt ↓",
    "baseValue": "0.062",
    "oursValue": "0.050",
    "unit": "rad",
    "delta": "−19.4%",
    "deltaLabel": "lower mean tilt",
    "description": "From grasp to placement, Base drops a glass while QCP delivers the glasses upright. QCP reduces mean tray tilt by 19.4%.",
    "note": "Aggregate mean tilt · 2× playback. Individual executions shown.",
    "endResult": {
      "at": 13,
      "base": {
        "kicker": "",
        "title": "A glass falls",
        "unit": "",
        "detail": "Mean tray tilt · 0.062 rad"
      },
      "ours": {
        "kicker": "",
        "title": "Successful delivery",
        "unit": "",
        "detail": "Mean tray tilt · 0.050 rad"
      }
    }
  },
  {
    "id": "square-speed",
    "title": "Faster insertion",
    "task": "Square insertion",
    "quality": "Speed",
    "base": "assets/media/square-speed-base.mp4",
    "ours": "assets/media/square-speed-qcp.mp4",
    "basePoster": "assets/media/square-speed-base.jpg",
    "oursPoster": "assets/media/square-speed-qcp.jpg",
    "metric": "Steps to success ↓",
    "baseValue": "331",
    "oursValue": "135",
    "unit": "steps",
    "delta": "−59.2%",
    "deltaLabel": "fewer steps",
    "description": "The same insertion takes 331 steps for Base and 135 for QCP. Both displayed rollouts finish successfully.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "square-safety",
    "title": "Avoid the worker’s hand",
    "task": "Square insertion · safety",
    "quality": "Safety",
    "base": "assets/media/square-safety-base.mp4",
    "ours": "assets/media/square-safety-qcp.mp4",
    "basePoster": "assets/media/square-safety-base.jpg",
    "oursPoster": "assets/media/square-safety-qcp.jpg",
    "metric": "Closest approach ↑",
    "baseValue": "2.6",
    "oursValue": "12.5",
    "unit": "cm",
    "delta": "+9.9 cm",
    "deltaLabel": "greater minimum separation",
    "description": "Both rollouts complete the insertion. Base enters the 9 cm region around the simulated worker’s hand, while QCP keeps a greater distance and stays outside.",
    "note": "Shown rollout · matched initial state · 1× playback. Base: accumulated-data BC. Distance is to the hazard center (radius 9 cm). Trail: green = clear, amber = near, red = inside.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "conveyor",
    "title": "Keep up with the line",
    "task": "Conveyor work",
    "quality": "Speed",
    "base": "assets/media/conveyor-base.mp4",
    "ours": "assets/media/conveyor-qcp.mp4",
    "basePoster": "assets/media/conveyor-base.jpg",
    "oursPoster": "assets/media/conveyor-qcp.jpg",
    "metric": "Throughput ↑",
    "baseValue": "7.1",
    "oursValue": "8.7",
    "unit": "cans/min",
    "delta": "+22.5%",
    "deltaLabel": "higher throughput",
    "description": "Over the same interval, Base completes 3 placements and QCP completes 4. QCP increases throughput from 7.1 to 8.7 cans/min.",
    "note": "Aggregate throughput · 1.5× playback. Equal-duration excerpts.",
    "endResult": {
      "at": 20,
      "base": {
        "kicker": "Throughput",
        "title": "7.1",
        "unit": "cans / min",
        "detail": "3 placements in this excerpt"
      },
      "ours": {
        "kicker": "Throughput",
        "title": "8.7",
        "unit": "cans / min",
        "detail": "+22.5% throughput · 4 placements shown"
      }
    }
  },
  {
    "id": "transport-safety",
    "title": "Avoid the worker’s hand",
    "task": "Two-arm transport · safety",
    "quality": "Safety",
    "base": "assets/media/transport-safety-base.mp4",
    "ours": "assets/media/transport-safety-qcp.mp4",
    "basePoster": "assets/media/transport-safety-base.jpg",
    "oursPoster": "assets/media/transport-safety-qcp.jpg",
    "metric": "Closest approach ↑",
    "baseValue": "7.6",
    "oursValue": "14.9",
    "unit": "cm",
    "delta": "+7.3 cm",
    "deltaLabel": "greater minimum separation",
    "description": "Both rollouts complete the transfer. Base enters the 9 cm region around the simulated worker’s hand, while QCP keeps a greater distance and stays outside.",
    "note": "Shown rollout · matched initial state · 1× playback. Base: accumulated-data BC. Distance is to the hazard center (radius 9 cm). Trail: green = clear, amber = near, red = inside.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "packing-path",
    "title": "Less joint travel",
    "task": "Packing a box",
    "quality": "Efficiency",
    "base": "assets/media/packing-path-base.mp4",
    "ours": "assets/media/packing-path-qcp.mp4",
    "basePoster": "assets/media/packing-path-base.jpg",
    "oursPoster": "assets/media/packing-path-qcp.jpg",
    "metric": "Joint path length ↓",
    "baseValue": "23.6",
    "oursValue": "5.14",
    "unit": "rad",
    "delta": "−78.2%",
    "deltaLabel": "less joint travel",
    "description": "QCP packs the box with less accumulated joint movement: 5.14 rad compared with 23.6 rad for Base.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "square-smooth",
    "title": "Smoother insertion",
    "task": "Square insertion",
    "quality": "Smoothness",
    "base": "assets/media/square-smooth-base.mp4",
    "ours": "assets/media/square-smooth-qcp.mp4",
    "basePoster": "assets/media/square-smooth-base.jpg",
    "oursPoster": "assets/media/square-smooth-qcp.jpg",
    "metric": "Action jerk ↓",
    "baseValue": "122",
    "oursValue": "9.55",
    "unit": "×10⁻³",
    "delta": "Completed",
    "deltaLabel": "with QCP",
    "description": "QCP completes the insertion with lower recorded action jerk.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      false,
      true
    ]
  },
  {
    "id": "pot-coordination",
    "title": "Move together",
    "task": "Lifting a pot",
    "quality": "Coordination",
    "base": "assets/media/pot-coordination-base.mp4",
    "ours": "assets/media/pot-coordination-qcp.mp4",
    "basePoster": "assets/media/pot-coordination-base.jpg",
    "oursPoster": "assets/media/pot-coordination-qcp.jpg",
    "metric": "Arm speed difference ↓",
    "baseValue": "0.424",
    "oursValue": "0.199",
    "unit": "",
    "delta": "−53.1%",
    "deltaLabel": "smaller speed difference",
    "description": "QCP brings the two arms closer in speed while lifting the pot.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "book-speed",
    "title": "A quicker pickup",
    "task": "Picking a book",
    "quality": "Speed",
    "base": "assets/media/book-speed-base.mp4",
    "ours": "assets/media/book-speed-qcp.mp4",
    "basePoster": "assets/media/book-speed-base.jpg",
    "oursPoster": "assets/media/book-speed-qcp.jpg",
    "metric": "Completion time ↓",
    "baseValue": "3.55",
    "oursValue": "2.6",
    "unit": "s",
    "delta": "−26.8%",
    "deltaLabel": "less completion time",
    "description": "Both policies retrieve the book. With speed conditioning, QCP completes this example in 2.6 seconds, compared with 3.55 seconds for Base.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "stack-smooth",
    "title": "Smooth, then stack",
    "task": "Stacking two blocks",
    "quality": "Smoothness",
    "base": "assets/media/stack-smooth-base.mp4",
    "ours": "assets/media/stack-smooth-qcp.mp4",
    "basePoster": "assets/media/stack-smooth-base.jpg",
    "oursPoster": "assets/media/stack-smooth-qcp.jpg",
    "metric": "Mean joint jerk ↓",
    "baseValue": "125",
    "oursValue": "55.8",
    "unit": "",
    "delta": "−55.4%",
    "deltaLabel": "lower joint jerk",
    "description": "QCP reduces abrupt joint motion while stacking, with mean joint jerk decreasing from 125 to 55.8.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "handover-path",
    "title": "A smoother handover",
    "task": "Object handover",
    "quality": "Smoothness",
    "base": "assets/media/handover-path-base.mp4",
    "ours": "assets/media/handover-path-qcp.mp4",
    "basePoster": "assets/media/handover-path-base.jpg",
    "oursPoster": "assets/media/handover-path-qcp.jpg",
    "metric": "Mean joint jerk ↓",
    "baseValue": "139",
    "oursValue": "38.1",
    "unit": "",
    "delta": "−72.6%",
    "deltaLabel": "lower joint jerk",
    "description": "QCP performs a smoother handover, with mean joint jerk decreasing from 139 to 38.1.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "valve-coordination",
    "title": "Keep both hands level",
    "task": "Turning a valve",
    "quality": "Coordination",
    "base": "assets/media/valve-coordination-base.mp4",
    "ours": "assets/media/valve-coordination-qcp.mp4",
    "basePoster": "assets/media/valve-coordination-base.jpg",
    "oursPoster": "assets/media/valve-coordination-qcp.jpg",
    "metric": "Gripper height difference ↓",
    "baseValue": "0.00646",
    "oursValue": "0.00209",
    "unit": "",
    "delta": "−67.6%",
    "deltaLabel": "smaller height difference",
    "description": "QCP reduces the height difference between the grippers in this example, alongside lower joint travel and a shorter completion time.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "packing-speed",
    "title": "Pack with less delay",
    "task": "Packing a box",
    "quality": "Speed",
    "base": "assets/media/packing-speed-base.mp4",
    "ours": "assets/media/packing-speed-qcp.mp4",
    "basePoster": "assets/media/packing-speed-base.jpg",
    "oursPoster": "assets/media/packing-speed-qcp.jpg",
    "metric": "Completion time ↓",
    "baseValue": "15.6",
    "oursValue": "6.1",
    "unit": "s",
    "delta": "−60.9%",
    "deltaLabel": "less completion time",
    "description": "QCP finishes the displayed packing sequence in 6.1 seconds, compared with 15.6 seconds for Base.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "book-path",
    "title": "A more economical reach",
    "task": "Picking a book",
    "quality": "Efficiency",
    "base": "assets/media/book-path-base.mp4",
    "ours": "assets/media/book-path-qcp.mp4",
    "basePoster": "assets/media/book-path-base.jpg",
    "oursPoster": "assets/media/book-path-qcp.jpg",
    "metric": "Joint path length ↓",
    "baseValue": "6.12",
    "oursValue": "4.62",
    "unit": "rad",
    "delta": "−24.5%",
    "deltaLabel": "less joint travel",
    "description": "Conditioning on joint travel changes the pickup motion: QCP uses 4.62 rad of accumulated joint movement versus 6.12 rad for Base.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      true,
      true
    ]
  },
  {
    "id": "transport-smooth",
    "title": "A steadier transfer",
    "task": "Two-arm transport",
    "quality": "Smoothness",
    "base": "assets/media/transport-smooth-base.mp4",
    "ours": "assets/media/transport-smooth-qcp.mp4",
    "basePoster": "assets/media/transport-smooth-base.jpg",
    "oursPoster": "assets/media/transport-smooth-qcp.jpg",
    "metric": "Action jerk ↓",
    "baseValue": "188",
    "oursValue": "11.8",
    "unit": "×10⁻³",
    "delta": "Completed",
    "deltaLabel": "with QCP",
    "description": "QCP completes the transfer with lower recorded action jerk.",
    "note": "Shown rollout · matched initial state · 1× playback.",
    "outcomes": [
      false,
      true
    ]
  }
];

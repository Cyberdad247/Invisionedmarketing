# Marketers In Black - Main Layout Wireframe

## Overall Structure
The UI will use a main grid layout, dividing the screen into a sidebar and a main content area. This aligns with the vertical slice architecture, grouping feature-related code together.

```
+---------------------------------------+-------------------------------------------+
|                                       |                                           |
|                                       |                                           |
|          SIDEBAR (30%)                |          MAIN CONTENT (70%)               |
|                                       |                                           |
|                                       |                                           |
+---------------------------------------+-------------------------------------------+
```

## Sidebar (Left Side - 30% width)
The sidebar will be divided into two main sections:

### Top Section: Text-to-Image Chat Box
```
+---------------------------------------+
|  TEXT-TO-IMAGE CHAT                   |
|  +-------------------------------+    |
|  | Chat History                  |    |
|  | [AI]: How can I help you?     |    |
|  | [User]: Create an image of... |    |
|  | [AI]: *Generated Image*       |    |
|  |                               |    |
|  | ...                           |    |
|  +-------------------------------+    |
|                                       |
|  +-------------------------------+    |
|  | Input Field                   |    |
|  | [Type your prompt here...]    |    |
|  +-------------------------------+    |
|  [Send Button]                        |
+---------------------------------------+
```

### Bottom Section: Agent Configuration Panel
```
+---------------------------------------+
|  AGENT CONFIGURATION                  |
|                                       |
|  Model Selection:                     |
|  [Dropdown: GPT-4, Claude, etc.]      |
|                                       |
|  Parameters:                          |
|  Temperature: [Slider: 0.0 - 1.0]     |
|  Max Tokens: [Input: 1000]            |
|  Top P: [Slider: 0.0 - 1.0]           |
|                                       |
|  Advanced Settings:                   |
|  [Toggle: Show/Hide]                  |
|  - Frequency Penalty                  |
|  - Presence Penalty                   |
|  - Stop Sequences                     |
|                                       |
|  [Save Configuration Button]          |
+---------------------------------------+
```

## Main Content Area (Right Side - 70% width)
The main content area will be divided into three sections:

### Top Section: ClaraVerse UI/UX Components
```
+-------------------------------------------+
|  CLARAVERSE UI/UX COMPONENTS              |
|                                           |
|  +-----------------------------------+    |
|  | ReactFlow Workflow Designer       |    |
|  | [Interactive Node-Based Interface]|    |
|  |                                   |    |
|  | [Nodes and connections visualized]|    |
|  +-----------------------------------+    |
|                                           |
|  Interactive Components:                  |
|  [Framer Motion Animations]               |
|  [Responsive UI Elements]                 |
+-------------------------------------------+
```

### Middle Section: Agent Orchestration and Workflow
```
+-------------------------------------------+
|  AGENT ORCHESTRATION & WORKFLOW           |
|                                           |
|  Agent Builder:                           |
|  [Create New Agent Button]                |
|                                           |
|  +-----------------------------------+    |
|  | Agent Workspace                   |    |
|  | [Visual Tools for Agent Creation] |    |
|  | [Parameter Configuration]         |    |
|  | [Connection Points]               |    |
|  +-----------------------------------+    |
|                                           |
|  Workflow Management:                     |
|  [Save Workflow] [Deploy Workflow]        |
+-------------------------------------------+
```

### Bottom Section: Ten Framework Integration
```
+-------------------------------------------+
|  TEN FRAMEWORK INTEGRATION                |
|                                           |
|  Performance Metrics:                     |
|  +----------------+ +----------------+    |
|  | Response Time  | | Resource Usage |    |
|  | [Chart]        | | [Chart]        |    |
|  +----------------+ +----------------+    |
|                                           |
|  System Analytics:                        |
|  +-----------------------------------+    |
|  | Real-time Data Visualization      |    |
|  | [Interactive Dashboard]           |    |
|  +-----------------------------------+    |
|                                           |
|  [Export Data Button] [Settings Button]   |
+-------------------------------------------+
```

## Navigation and Global Elements
```
+---------------------------------------+-------------------------------------------+
| LOGO: Marketers In Black              | USER PROFILE | NOTIFICATIONS | SETTINGS   |
+---------------------------------------+-------------------------------------------+
```

## Responsive Behavior
- On mobile devices, the sidebar will collapse to a hamburger menu
- Main content sections will stack vertically on smaller screens
- Touch-friendly controls will be implemented for mobile users

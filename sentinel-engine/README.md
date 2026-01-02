# Sentinel Engine

## Overview

The Sentinel Engine is a robust framework designed for forensic analysis and decision-making in complex systems. It leverages Angular for the frontend and Python for backend logic, ensuring a seamless integration of user interface and data processing.

## Features

- **Forensic Briefing**: The `SentinelBriefComponent` provides real-time updates on the status of forensic triggers, allowing users to quickly assess risk levels and take necessary actions.
- **Trigger Evaluation**: The backend logic in `sentinel_logic.py` evaluates various forensic triggers, including:
  - **TR-01**: Temporal Mismatch
  - **TR-03**: Decision Paradox
  - **TR-05**: Evidence Blindness
- **Resolution Rationale**: The `ResolutionRationaleComponent` ensures that users provide a rationale for decisions made in response to Sentinel alerts, promoting accountability and thoroughness.

## Setup

### Prerequisites

- Node.js and npm for the frontend
- Python 3.x for the backend

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sentinel-engine
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies (if any):
   ```
   cd functions
   pip install -r requirements.txt
   ```

## Usage

### Running the Frontend

To start the Angular application, navigate to the `frontend` directory and run:
```
ng serve
```
Access the application at `http://localhost:4200`.

### Running the Backend

To execute the backend logic, run:
```
python sentinel_logic.py
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
# Mano Mitra - Memory Aid for Alzheimer's Patients

Mano Mitra (meaning "Mind's Friend") is a web-based application designed to serve as a daily cognitive and memory aid for individuals with Alzheimer's disease and other forms of dementia. It provides a simple, accessible interface for managing daily schedules, recognizing loved ones, and ensuring safety through location-based reminders.

![image](https://github.com/user-attachments/assets/c67266d7-8ec8-487e-844a-7a9efcd7f9e9)
![image](https://github.com/user-attachments/assets/927c1eec-05c0-4c71-b259-d8cda1f5764d)
![image](https://github.com/user-attachments/assets/33031aa3-e918-4905-a16a-9d4288c20da4)

---

## Key Features

*   **Interactive Calendar & Day View**: Easily view and manage daily and weekly schedules. Past dates are disabled to reduce confusion.
*   **Advanced Reminders**: 
    *   **Standard Reminders**: For medications, appointments, and daily routines.
    *   **Timed Location Reminders**: Set a maximum duration for visits to specific locations (e.g., a park or hospital), with a prompt to check for assistance if the time limit is exceeded.
*   **Caregiver Management**: Keep a list of caregivers with their photos (facial recognition placeholder), relationship, and contact information. Designate a primary caregiver for quick access.
*   **Location Management**: Save important locations like "Home," "Hospital," or a "Daughter's House" with an interactive map view powered by Leaflet.js.
*   **Device Status**: A dedicated view to monitor the status of essential hardware like the camera and microphone (currently a placeholder for future real-time monitoring features).
*   **Fully Responsive**: Designed to work seamlessly on desktops, tablets, and mobile devices.
*   **Browser-Based & Offline-First**: Uses browser `localStorage` to save all data, meaning it works without an internet connection and requires no backend server.

---

## Tech Stack

*   **Frontend**: [React](https://react.dev/) (using modern hooks)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Mapping**: [Leaflet.js](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
*   **Build**: No build step required! The app uses modern ES Modules via an `importmap` in `index.html`.

---

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mano-mitra.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd mano-mitra
    ```
3.  **Start a local server:**
    *   If you have the **Live Server** extension in VS Code, right-click the `index.html` file and select "Open with Live Server".
    *   Alternatively, you can use any simple HTTP server. For example, with Python:
      ```bash
      # For Python 3
      python -m http.server
      ```
4.  **Open the app:**
    Open your web browser and navigate to the local address provided by your server (e.g., `http://127.0.0.1:5500` or `http://localhost:8000`).

---

## Project Structure

The project is organized into logical components to make it easy to navigate and maintain.

```
/
├── components/          # All React components (e.g., Calendar, Modals, Views)
├── services/            # Services for external APIs (e.g., Gemini)
├── index.html           # Main HTML entry point with importmap
├── index.tsx            # Main React application entry point
├── App.tsx              # Root component with state management and routing logic
├── types.ts             # TypeScript type definitions for the application
├── metadata.json        # Application metadata
└── README.md            # This file
```

---

<div align="center">
  <img src="https://path-to-your-logo-or-banner-image.png" alt="PersonaCraft AI Banner" width="600"/>
  <h1>PersonaCraft AI</h1>
  <p>
    A full-stack AI chatbot platform that creates dynamic, conversational personas by analyzing user-uploaded chat histories.
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  </p>
</div>


> **Live Demo:** [**personacraft.your-domain.com**](https://personacraft.your-domain.com)

---
## ## About The Project

PersonaCraft is a full-stack web application built with the MERN stack that allows users to create and interact with AI-driven chatbots. The platform's core feature is its dynamic persona generation pipeline, which uses the Google Gemini API to analyze the communication style from a user-uploaded WhatsApp chat log. It then constructs a unique personality blueprint, enabling the AI to mimic that person in a real-time, streaming conversation.

This project was built to explore the intersection of large language models, user data analysis, and modern web development, with a strong focus on security, scalability, and user experience.

---
## ## Key Features ✨

* **Secure User Authentication:** Users can sign up and log in, with personas and chat histories securely tied to their accounts via JWT authentication.
* **Dynamic AI Persona Generation:** A unique two-stage AI pipeline:
    1.  **AI Moderation:** First, content is analyzed for safety to filter out inappropriate language.
    2.  **AI Summarization:** If safe, the chat log is summarized to capture the persona's unique tone, emoji usage, and communication style.
* **Real-time Streaming Chat:** Responses from the AI are streamed word-by-word using Server-Sent Events (SSE) for a fluid, interactive conversation.
* **Persistent Conversation History:** Chat histories are saved to a MongoDB database, allowing users to continue conversations later.
* **Full CRUD for Personas:** Users can create, read, and delete their personas through an intuitive UI.
* **Responsive & Modern UI:** A sleek, dark-mode interface built with React and Tailwind CSS, featuring loading skeletons and toast notifications for a smooth user experience.

---
## ## Tech Stack 🛠️

This project is built with a modern, professional technology stack.

| Frontend              | Backend                 | Database      | AI Service           |
|-----------------------|-------------------------|---------------|----------------------|
| React.js              | Node.js                 | MongoDB       | Google Gemini API    |
| Vite                  | Express.js              | Mongoose      |                      |
| Tailwind CSS          | JWT (JSON Web Tokens)   |               |                      |
| Axios                 | Bcrypt.js               |               |                      |
| React Router          | Multer                  |               |                      |

---
## ## Getting Started

To get a local copy up and running, follow these simple steps.

### ### Prerequisites
* **Node.js** and **npm** installed (`v18` or higher recommended).
* A **MongoDB** database instance (local or from a cloud provider like MongoDB Atlas).
* A **Google AI API Key** with the Gemini API enabled.

### ### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/PersonaCraft-AI.git](https://github.com/your-username/PersonaCraft-AI.git)
    cd PersonaCraft-AI
    ```
2.  **Setup the Backend:**
    ```sh
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your secret keys:
    ```
    GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"
    MONGO_URI="YOUR_MONGODB_CONNECTION_STRING"
    JWT_SECRET="YOUR_SUPER_SECRET_RANDOM_STRING_FOR_JWT"
    ```
3.  **Setup the Frontend:**
    ```sh
    cd ../frontend
    npm install
    ```

### ### Running the Application
You'll need two terminals running concurrently.

* **In terminal 1 (for the Backend):**
  ```sh
  cd backend
  npm start
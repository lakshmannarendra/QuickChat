High Level Flow 

[![](https://mermaid.ink/img/pako:eNp9VNtu4jAQ_ZXIz4CaC7c8rEThBWmromX3ZZ1qZZIppE3syHZaWODfO9ghFy3sQ-zxzJk542M7RxKLBEhIIv6aic94x6R2fi4i7jiq3GwlK3bOPEuB64vLcWZFQfEbvKn9i_U8sZTTHIeWb8W2oKgZK89c5IXgWEbRxqxjXMNe02quvDOlANF2qnzf0w3Fr83i9PvfTkusKLU6tWj-AzEsd-OW8G4Y6Zt9m9AP4AnIS2ZR1CLZiCg1YMCU6ezVhFdSfKQJNJlYKOId6dcgP0D-sbl2QZWZUO1KBstC7dSSVIosw75oy74eGR55pqidrr40STL4ZBJoY96U3bZhdvBLXbq3zO1mTHDOsqzSu6L_pzeDm8UxKFPINnQbZalq9Vs8NtI0fUdJvNmQVDsQ8Tvo5TO1xmD5XG1twTTbMIUSCL4Vi8ermpkok5QzeaCN-dKtVV0FlvV1msOp82juYaySXWqDuSyctRYSL04X1vAb4BMk6U1kLYDtwwq9WjrVoVyBpEe2Mk1IqGUJPZKDxJeMS3K85EZE7yCHiIRoJky-R_ibOGNOwfhvIfJrmhTldkfCV5YpXJVFwjQsUobC1xBWarE-8LhOMY9mLkquSej7Y1OThEeyJ6HnDdyROx663jDAYTIa9siBhIE7CDzfRc-D646CyejcI39NFw-DaTAZe9ORH3iTYDr2_fMXKpGdiA?type=png)](https://mermaid.live/edit#pako:eNp9VNtu4jAQ_ZXIz4CaC7c8rEThBWmromX3ZZ1qZZIppE3syHZaWODfO9ghFy3sQ-zxzJk542M7RxKLBEhIIv6aic94x6R2fi4i7jiq3GwlK3bOPEuB64vLcWZFQfEbvKn9i_U8sZTTHIeWb8W2oKgZK89c5IXgWEbRxqxjXMNe02quvDOlANF2qnzf0w3Fr83i9PvfTkusKLU6tWj-AzEsd-OW8G4Y6Zt9m9AP4AnIS2ZR1CLZiCg1YMCU6ezVhFdSfKQJNJlYKOId6dcgP0D-sbl2QZWZUO1KBstC7dSSVIosw75oy74eGR55pqidrr40STL4ZBJoY96U3bZhdvBLXbq3zO1mTHDOsqzSu6L_pzeDm8UxKFPINnQbZalq9Vs8NtI0fUdJvNmQVDsQ8Tvo5TO1xmD5XG1twTTbMIUSCL4Vi8ermpkok5QzeaCN-dKtVV0FlvV1msOp82juYaySXWqDuSyctRYSL04X1vAb4BMk6U1kLYDtwwq9WjrVoVyBpEe2Mk1IqGUJPZKDxJeMS3K85EZE7yCHiIRoJky-R_ibOGNOwfhvIfJrmhTldkfCV5YpXJVFwjQsUobC1xBWarE-8LhOMY9mLkquSej7Y1OThEeyJ6HnDdyROx663jDAYTIa9siBhIE7CDzfRc-D646CyejcI39NFw-DaTAZe9ORH3iTYDr2_fMXKpGdiA)


# QuickChat

QuickChat is a real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features user authentication, AI-powered chat, emoji support, and a modern UI.

## Features
- User authentication with json_web_token(login, register, profile)
- Real-time chat between users using socket.io
- AI assistant integration with gemini
- Emoji picker
- Responsive and modern UI with tailwind css
- Image upload (Cloudinary)


## Tech Stack
- **Frontend:** React, Vite, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** gemini  API 
- **Image Hosting:** Cloudinary
- **Deployment:** Vercel

## Folder Structure
```
QuickChat-main/
├── client/         # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/         # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)
- gemini API key (for AI chat)

### Environment Variables
Create `.env` files in both `client` and `server` directories with the following variables:

**server/.env**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_geminiai_api_key
```

**client/.env**
```
VITE_API_URL=http://localhost:5000
```

### Installation

#### 1. Clone the repository
```sh
git clone https://github.com/lakshmannarendra/QuickChat

```

#### 2. Install dependencies
```sh
cd server
npm install
cd ../client
npm install
```

#### 3. Start the development servers
- **Backend:**
  ```sh
  cd server
  npm start
  ```
- **Frontend:**
  ```sh
  cd client
  npm run dev
  ```

#### 4. Open the app
Visit `http://localhost:5173` in your browser.

## Scripts
- `npm start` (server): Starts the backend server
- `npm run dev` (client): Starts the React frontend

## Deployment
- The app is ready to deploy on Vercel (see `vercel.json` in both `client` and `server`)

---

**Author:** Alluri Lakshman Narendra – Indian Institute of Technology (IIT) Dharwad – Computer Science and Engineering (CSE)


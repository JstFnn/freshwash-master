## 📦 Installation

### Clone Repo

    cd freshwash-master

## 🖥 Frontend Setup

    cd freshwash-frontend
    npm install
    create .env example
        # API URL
        REACT_APP_API_URL=http://localhost:5000/api
        # Environment
        REACT_APP_ENV=development
    npm run dev

## 🛢 Backend Setup

    cd freshwash-backend
    npm install
    create .env example
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=
        DB_NAME=freshwash_db
        JWT_SECRET=your_jwt_secret
    npm run dev

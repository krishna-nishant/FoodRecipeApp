# Food Recipe App

![Food Recipe App](./frontend/public/images/food.png)

## Description

The Food Recipe App is a user-friendly full-stack web application that allows users to discover, save, and share their favorite recipes. Users can search for recipes by ingredients or categories, submit their own community recipes with images, rate and review recipes from other users, and manage their favorites in a personalized collection. The application features user authentication, detailed recipe instructions, and a modern responsive interface with dark mode support.

## Live Demo

Check out the live application: [Food Recipe App](https://food-recipe-lovat-five.vercel.app/)

## Features

- **Recipe Search**: Search recipes by ingredients, cuisine, and meal type
- **User Authentication**: Secure registration and login system
- **Community Recipes**: Share your own recipes with the community
- **Image Uploads**: Add images to your recipes
- **Ratings & Reviews**: Rate and review community recipes
- **Favorite Recipes**: Save and manage your favorite recipes
- **Detailed Recipe Pages**: View ingredients and step-by-step instructions
- **Dark Mode**: Toggle between light and dark modes for better user experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- **React**: JavaScript library for building user interfaces
- **React Router**: For navigation between different components
- **TailwindCSS**: Utility-first CSS framework for styling
- **Next-themes**: For dark mode implementation
- **Lucide React**: For UI icons
- **Context API**: For state management

### Backend

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing recipes, users, and reviews
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT Authentication**: For secure user authentication
- **Multer**: For handling image uploads
- **Bcrypt.js**: For password hashing

## Project Structure

```
Food Recipe App/
├── frontend/                  # React frontend application
│   ├── public/                # Public assets
│   │   ├── images/            # Image assets
│   │   └── index.html         # HTML template
│   ├── src/                   # Source files
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context providers
│   │   ├── App.jsx            # Main App component
│   │   └── index.jsx          # Entry point
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── backend/                   # Node.js backend application
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utility functions
│   ├── uploads/               # Uploaded recipe images
│   ├── server.js              # Server entry point
│   └── package.json           # Backend dependencies
│
└── README.md                  # Project documentation
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/krishna-nishant/FoodRecipeApp.git
   cd FoodRecipeApp/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGO_DB_USER=your_mongodb_username
   MONGO_DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Register/Login**: Create a new account or login to access all features
2. **Search Recipes**: Use the search bar on the homepage to find recipes
3. **Browse Community Recipes**: Explore recipes shared by other users
4. **Add a Recipe**: Click "Add Recipe" button to share your own recipe
5. **Save Favorites**: Click the star icon to save recipes to your favorites
6. **Rate & Review**: Rate community recipes and leave reviews
7. **Toggle Dark Mode**: Use the theme toggle in the navigation bar

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Recipes

- `GET /api/recipes/community` - Get all community recipes
- `GET /api/recipes/community/:id` - Get a specific community recipe
- `POST /api/recipes/community` - Add a new community recipe
- `PUT /api/recipes/community/:id` - Update a community recipe
- `DELETE /api/recipes/community/:id` - Delete a community recipe

### Reviews

- `POST /api/recipes/community/:id/reviews` - Add a review to a recipe

### User Profile

- `POST /api/users/save-recipe/:id` - Save a recipe to favorites
- `DELETE /api/users/remove-recipe/:id` - Remove a recipe from favorites
- `GET /api/users/favorites` - Get user's favorite recipes

## Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Render


## Acknowledgements

- [Recipe data sources]
- [UI inspiration]

---

Created by [Krishna Nishant](https://github.com/krishna-nishant) 
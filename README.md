## DownloadJS

A software download hub with a user-friendly frontend and a powerful admin panel.

## Prerequisites

Node.js: Version 16 or higher
MongoDB: Running locally (e.g., mongodb://localhost:27017) or via a cloud service like MongoDB Atlas

## Installation

Follow these steps to set up the project locally:

1. Clone the repository and install dependencies: git clone https://github.com/vuongdq/downloadjs.git cd downloadjs npm install
2. Configure environment variables: Create a .env file in the root directory with the following content: MONGO_URI=mongodb://localhost:27017/software_hub JWT_SECRET=your_jwt_secret_here PORT=3000
Replace your_jwt_secret_here with a secure secret key for JWT authentication.
3. (Optional) Seed the database: Populate the database with sample data (users, categories, softwares): npm run seed
4. Start the server: npm start
## Usage

Frontend: Access the main site at http://localhost:3000/
Admin Panel: Access the admin interface at http://localhost:3000/admin
Default admin login: admin@example.com / admin123
## Features
```
User Authentication: Register and login functionality with JWT-based security.
Software Categories: Browse software organized by categories with pagination support.
Software Downloads: Download links with a 5-second countdown for non-logged-in users; instant access for logged-in users.
Admin Panel: Manage users, categories, and software with CRUD operations and pagination (10 items per page).
AdSense Ready: Pre-designed banner positions for advertisements (top, middle, left, right).
Responsive Design: Frontend and admin panel adapt to various screen sizes.
```
## Project Structure
```
├── models/              Mongoose schemas (User, Category, Software)
├── routes/              API routes (auth, categories, softwares)
├── middleware/          Authentication middleware
├── public/              Static files
│   ├── frontend/        Frontend HTML, JS, CSS
│   ├── admin/           Admin panel HTML, JS, CSS
├── server.js            Main server file
├── seed.js              Script to seed sample data
├── package.json         Dependencies and scripts
├── .gitignore           Ignored files (e.g., node_modules, .env)
├── README.md            This file
```

## Dependencies
```
express: Web framework
mongoose: MongoDB ORM
bcryptjs: Password hashing
jsonwebtoken: JWT authentication
dotenv: Environment variable management
Install them using the commands in the Installation section.
```
## Notes
```
Ensure MongoDB is running before starting the server.
The .env file is not included in the repository for security reasons. You must create it manually.
Sample data includes 10 users, 10 categories, and 20 software entries for testing.
```
## Contributing
Feel free to fork this repository, submit pull requests, or open issues for suggestions and bug reports.

## License
This project is licensed under the MIT License.

## Author

VuongDQ - GitHub: https://github.com/vuongdq
# CSC-317 Assignment: Term Project
## 🔗 Deployed Link: https://laced-balanced-sodium.glitch.me/
This repository contains the files for CSC-317 Assignment: Term Project, with the final product being an e-commerce website.

## 🎨 Design Choices
Basic pages and features of the webpage:
- Storefront
- Products
- Payment 
- Login / Signup
- About
- FAQ
- User Profile
- Search
- Navigation

Color palette:

<img width="500" src="https://i.imgur.com/PJSxSf0.png">

Fonts:

- Bungee Tint: https://fonts.google.com/specimen/Bungee+Tint

- Poppins: https://fonts.google.com/specimen/Poppins

## 🚀 How to Run
Follow these steps to set up and run the website locally:

### 1) Clone the Repository
```
cd directory-to-clone-repository-into
git clone https://github.com/warrantyvoidifremoved/CSC317-TermProject.git
cd cloned-repository
```

### 2) Install Dependencies
Make sure you have Node.js and npm installed. Then run:
```
npm install
```
This will install all required dependencies listed in `package.json`.


### 3) Setup Environment Variables
Create a .env file in the root directory of the project:
```
touch .env
```
Add the following environment variable to the `.env` file:
```
SESSION_SECRET=your_secret_key_here
```
`SESSION_SECRET` is used to sign the session ID cookie for login sessions. It should be a long, random string to ensure security.

### 4) Run the Application
Start the server with:
```
node app.js
```

### 5) Access the Website
Once the server is running, open your browser and go to: http://localhost:3000

### Notes
- Static files (CSS, JS, images) are served from the /public folder
- Views are written in Pug and located in /views
- Express routes are located in /routes
- The SQLite database is located at /db/database.db

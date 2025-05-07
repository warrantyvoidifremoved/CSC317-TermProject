# CSC-317 Assignment: Term Project
## 🔗 Deployed Link: TBD
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

Color palette: TBD

Fonts: TBD

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

### 3) Run the Application
Start the server with:
```
node app.js
```

### 4) Access the Website
Once the server is running, open your browser and go to: http://localhost:3000

### Notes
- Static files (CSS, images) are served from the /public folder
- Views are written in Pug and located in /views
- Express routes are organized in /routes
- The SQLite database is located at /db/database.db

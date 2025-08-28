# Wanderlust

[![Node.js](https://img.shields.io/badge/Node.js-22.14.0-green)](https://nodejs.org/) 
[![License](https://img.shields.io/badge/License-ISC-blue)](https://opensource.org/licenses/ISC)  

**Author:** Vineet Raj  
**Version:** 1.0.0  

---

## Live Demo
Check out the live application here: [Wanderlust Live](https://wanderlust-iir5.onrender.com)

---

## Project Overview
**Wanderlust** is a web application built using **Node.js**, **Express**, and **MongoDB** following the **MVC (Model-View-Controller)** architecture. The app allows users to explore, create, and manage travel listings with image uploads, user authentication, and session management.

---

## Features
- MVC Framework is used(Models, Views and Controllers)
- User authentication with **Passport.js** (Local strategy)
- Session management using **express-session** and **connect-mongo**
- Image uploads via **Multer** and **Cloudinary**
- Data validation with **Joi**
- Templating using **EJS** and **EJS-Mate**
- RESTful routing with **Express**
- Fully structured **MVC architecture** for maintainable code

---

## Technologies Used
- **Node.js** (v22.14.0)
- **Express.js** (v5.1.0)
- **MongoDB** & **Mongoose**
- **Passport.js** & **passport-local-mongoose**
- **Cloudinary** (for image storage)
- **Multer & multer-storage-cloudinary** (for image handling)
- **EJS & ejs-mate** (view templates)
- **Connect-flash** (flash messages)
- **Joi** (input validation)
- **dotenv** (environment variables)
- **Method-override** (for PUT and DELETE requests)

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wanderlust.git
   ```
2.Navigate into the project folder:
  ```bash
  cd wanderlust
  ```
3.Install dependencies:
  ```bash
  npm install
  ```
4.Create a .env file and add your configuration variables:
   ```bash
   DB_URL=<Your MongoDB URL>
   CLOUD_NAME=<Your Cloudinary Cloud Name>
   API_KEY=<Your Cloudinary API Key>
   API_SECRET=<Your Cloudinary API Secret>
   SECRET=<Your Session Secret>
  ```
5.Start the server:
  ```bash
  node app.js
  Or, if using nodemon:
  nodemon app.js
  ```
Usage
Users can sign up, log in, and log out.
Authenticated users can create, edit, and delete listings.
Listings include images uploaded to Cloudinary.
Validation ensures all inputs are correct and secure.

Contribution
Feel free to fork, clone, and make pull requests to improve this project.

License
This project is licensed under the ISC License.

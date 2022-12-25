# YelpCamp
This is the final project of a Fullstack Webdeveloper course I've taken - by Colt Steele

#### _**IMPORTANT NOTE**_ -

This project does not have a mongoDB connection setup. Setup the connection based on the environments sample.
For the code to run all of the .env.sample has to be fulfilled - some of them have default fallbacks.

While developing the App I've been using a locally mongoDB and later (before Heroku became only paid) I had this App hosted with Heroku.

## Getting Started

 You have to run `npm install`
 
 To seed the database with new campgrounds you can run `node seeds/index.js`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.
(PORT = 3000 by default)

## File structure

#### `cloudinary` - This folder holds the index.js file for setting up cloudinary to work with the app
#### `controllers` - These hold all of the callback functions that each route will call
#### `models` - This holds all of our data models
#### `public` - This hold all the CSS style sheets and Javascript code used by the views
#### `routes` - This folder holds all the routes
#### `seeds` - Holds all the seed files that can be used to seed the database
#### `utils` - Holds utility functions
#### `views` - Holds all the views
#### `app.js` - Hold the express config, routes and mongoDB connection etc.
#### `middleware.js` - Holds the middleware that is used in some of the routes
#### `schemas.js` - This file holds the schemas for validation of the data models and is being used in middlewares.js to validate incomming data from the UI

#### `.env.sample` - This file shows what external values is needed for the application to run (some values have a default fallback)

#### `package.json` - Defines npm behaviors like the scripts defined in the README's scripts section

#### `.gitignore` - Tells git which files to ignore

#### `README` - This file!

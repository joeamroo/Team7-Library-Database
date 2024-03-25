# Working with the Server
So as of right now guys we have the front-end hosted on vercel (https://cougarchronicles.vercel.app/) and we are trying to set up the backend

### Server folder
In the server folder you will find that we have a server.js file an a routes folder. The routes folder is where we will have all the relevant javascript files that
will make communicate with the database, create dynamic html, etc. In the server.js file is where we have established a switch that will handle the routes to follow based on
the pathway provided. 

## Running the Server
With that defined, the first thing we want to do is run our node js server. Open up the terminal (within the repo) and enter 
```
node ./server/server.js
```
and if you navigate to 
```
http://localhost:3000/
```
you will find that the home page pops up. Now this is because in our server.js I have specified that when the url is (/) that it default to the homepage.

So in our server.js we will be handling static files (such as html, css, js for the front end) and then configuring further switch cases for the routes we need for 
backend development. 

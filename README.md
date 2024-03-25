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

## !!!Important!!!
Right now we are hosting our front end in vercel using local pathways to display basic html BUT as we start to create routes to the pages on the server, vercel will no longer render those pages. What I mean by that is that right now for example if I want to navigate from the homepage to the Classes and Research page, I follow the pathway
```
../Classes/classes.html
```
but once i start working with the backend, we will specify a route to classes for example 
```
case '/classes':
  serveStaticFile('./front-end/classes/classes.html', 'text/html', res);
  break;
```
and thus we will have to change the html pathway to classes to now be 
```
/classes rather than ../Classes/classes.html
```
and this is because the server's route will understand to display the html file based on what is in the url. 
I say this so that you are mindful that when you create a route, you are removing vercel's capability of navigating using our current pathways. 

## ALSO! We need to host both the backend and frontend at some point, however, since we're not using react and dynamically creating html content this is a lot more tricky
## So if any of you know how, PLSSS let me know :)

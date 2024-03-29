# Working on the Backend 
So as of right now we have the front-end hosted on vercel (https://cougarchronicles.vercel.app/) and the back-end is hosted on render (https://cougarchronicles.onrender.com). The way these two sources communicate is directly by using Http Requests in the JS files we have for our front end files. 

### Server folder
In the server folder you will find that we have a server.js file and a routes folder. The routes folder is where we will have all the relevant javascript files that
will make communicate with the database, create dynamic html, etc. In the server.js file is where we have established a switch that will handle the routes to follow based on
the pathway provided. 

# Step #1
So for most of our pages, we have specified a javascript file that works to make the page more dynamic, and it is also where we will call send any 'GET' or 'POST' requests that will allow us to send and get information from the backend, most specifically information from the database. The first thing you will have to do is define the url to get to the backend, and create variables that represent the routes you're calling (this is optional as you can use the entire url instead of using the variable)

So in your front-end page's js file include the following:
```
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const route1Url = `${backendUrl}/route1`;
const route2Url = `${backendUrl}/route2`;
```
You will most likely make as many route#Url (make the name have meaning to the page/function/purpose) as the number of routes you need to address in your front-end/backend.

Then comes the part of making a request by using XMLHttpRequest. The following code is an example of a 'GET' request from my catalog.js file
```
document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', initialCatalogUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const catalogResultsDiv = document.querySelector('.catalog-results');
            catalogResultsDiv.innerHTML = xhr.responseText;

            const limit = parseInt(document.getElementById('limit-select').value);
            updateItemsShownOnPage(limit);
        } 
    };
    xhr.send();
});
```
In this code I am indicating that I am making a GET request to the following route (initial-catalog), I defined this as one of my variables like the one above. I use xhr to append to the '.catalog-results' div based on what the response I get. 

# Step 2

Now you handle the incoming request from the front-end in the server folder. So modify the switch(request.method) within server.js based on the request. If its a 'GET' request then you modify the switch table to include your route
```
switch (request.method) {
        case 'GET':
            switch (pathname) {
                case '/initial-catalog':
                    getInitialCatalogInfo(res);
                    break;
            ------------- Additional routes ---------------    
            }
            break;
        case 'POST':
            if (pathname === '/route2') {
            ------------- Logic ---------------
            }
}

```
and if its a 'POST' request then you also modify this accordingly. Now here you will notice that I defined the route called '/initial-catalog' (which is the one I need to indicate in my front-end js) and it calls the getInitialCatalogInfo, which is a function inside of my catalog.js file (./server/routes/catalog.js). So if you are calling a function create a relevant js file in the routes folder and define your logic there and boom! Your front-end page should be getting/returning information from/to the backend.

## Additional
I should warn you the way that I have hosted the front-end and back-end using the forked repo off of our original, they are usually in-sync but most times they need to be manually synced, you can do this by clicking on forks within the repo and syncing it up. This will automatically trigger a new deployment to Render and Vercel so you will be able to see the changes. Mainly this is if u want to see how your backend code is working, if you mainly want to modify and see the changes to your front-end then just check the preview.

Also, for testing purposes we have two members right now (fake members)

ID: 1002001 Name: John Smith - has a fine 
ID: 1002002 Name: Sara Johnson - does not have a fine

I created these mainly to check the triggers but use them to test any insertions, updates, etc. And create data as needed.

TIP: If you are having issues with getting/receiving info from the backend i reccomend you add messages to ur code that will be printed to the console so you have a good idea of where its failing. Also, really really reccomend analyzing the network and application tabs to see any errors. 



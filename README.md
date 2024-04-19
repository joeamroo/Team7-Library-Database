# Project Files
Our files are structured by front-end and back-end. We have a front-end directory that holds all the HTML, CSS, and JS files relevant to the front-end. We then have a server folder that contains our server.js file that handles the routing of back-end requests. Within the server folder is also a routes directory that contains all the handlers for specific pages/tabs within the front-end. These js files have multiple functions that are referenced in the server.js file when handling routes. Also, our notification system for items on hold being available relies on using Twilio to send text messages, however, since we are using the trial version, the phone number must be added to the Twilio portal for the message to be sent. At this moment only one of the teammate's phone number is active and they are the one receiving the notification. We can add your phone number so that you can see the notification system.


## Cloning the Repository 

Using the link to the repository, you can click on the "code" and clone the repository in github desktop and open them in visual studios via github desktop.

```
https://github.com/joeamroo/Team7-Library-Database
```

If you would like to test the website locally, you can simply "show preview" on the home page. Since we are hosting our back-end in a seperate platform, the back-end will still be active even when only looking at the html preview. 


## Triggers
One of the triggers works by having an event reach a threshold of 10 members signing up for it, so the following events have been left at a registration of 9, so that if you were to sign up for them the registration will reach 10 and the trigger will be shown.
Events: Computer Lab, DIY Yarn Art, Family Dancing Night, and Toddler Time: Teddy Bear, Teddy Bear

## Alert!
#### We are hosting the back-end on Render and are currently under the free tier, thus our server shuts down after 30 minutes of inactivity. So when going to the site, whether locally or hosted you will have to wait 30-60 seconds for the server to become "live" again. However, you can reach out to the team beforehand so that we may start it up without making you wait that time. (Sorry!)

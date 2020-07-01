#Strategica

* REQUIREMENTS
    - Node.JS
        (Can be downloaded here: "https://nodejs.org/en/download/current/" if not installed)
    - Mongodb atlas database


* How to setup MongoDB atlas database
    - Go to www.mongodb.com, under products choose MongoDB Atlas.
    - Choose start free and sign up for the MongoDB.
    - Log in to your MongoDB account.
    - Follow the tutourial to set up database, but do not create test data.
    - You should now have created at least one user under Security/Database Access, and have whitelisted IP under Security/Network Access, as well as built a cluster under Atlas/Clusters.
    - In the cluster under Atlas/clusters press "connect", then press "Connect Your Application".
    - Highlight "Connection String Only" and copy the string.
    - in app.js line 32, exchange "Insert mongo database link here" with the copied string in quotation marks.
        (Should look like "mongodb+srv://<username>:<password>@cluster0-6hcej.azure.mongodb.net/test?retryWrites=true&w=majority" or something similar)
    - Now exchange <username> in the string for the username of the user you created under Security/Database Access and the <password> for the password of the same user. These should just be normal letters and numbers, not in "<>" brackets.
    

Now install dependencies and start the backend.


* How to install dependencies.
    - Open a terminal and navigate to this directory.
        (This can easily be done by opening the directory with a text editor such as Virtual Studio and opening the terminal there.)
    
    - Once at this folder in the terminal, type "npm install" and press enter.
        (This will download all dependencies in the package.json file)

* How to start the backend.
    - Once all dependencies have been installed, type "node app.js" and press enter.
        (You should get a console log saying "Server started on *number*" This number is the port on the localhost, and is set to 8000)
    
    - Go to your web browser and write "http://localhost:8000" and press enter.
        (You should now see the landing page of the web app.)
        (Here you can register new users, as well as log in to existing users.)

* How to stop the server.
    - while the server is running, in the terminal command line simply press "ctrl + c" to stop the server.

* An Admin user will be created automatically at the start of the back end provided no user with the ID of "admin" is found in the database.

* The admin can create, publish and finish assignments for the other users to complete after they have created a group.
    (This can be done in the assignments part)


Known errors:
	
	This version has been changed slightly to not infringe upon others work, this is expected to cause some errors.
* Avatar images has been removed, this might cause errors when one of the avatar images is to be viewed.


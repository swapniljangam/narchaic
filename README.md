# narchaic
Angular 2 UI and Node.js REST API code generator

Config folder contains 3 files:
1.  database.config.js consists database url. Replace the 'notes' in the url to your database name.
2.  entity_constants.config.js consists entities to be added as rest endpoints. 'name' field is the name of the entity and fields are the database schemas. The name field is appended with an 's' when accessing the endpoint, for example 'task' will give an endpoint http://localhost:port/tasks
3.  port.config.js consists port number on which the server will run. Replace 8080 with the desired port number.

After making changes in these files run 'node narchaic.js'
This will create all the necessary files and folders. You'll find servertest.js at the same level of narchaic.js
Running 'node servertest.js' will start the server at http://localhost:port/'your entity's

UI is still WIP :)

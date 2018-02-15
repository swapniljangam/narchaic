const entities = require("./config/entity_constants.config");
var fs = require("fs");
const port = require("./config/port.config");

function createFolderStructure() {
  var dir = ["./app", "./app/models"];
  entities.forEach(function(element) {
    dir.push("./app/models/" + element.name);
  }, this);
  dir.forEach(function(element) {
    if (!fs.existsSync(element)) {
      fs.mkdirSync(element, 0744);
    }
  }, this);
}

function createAppRoute() {
    var routeFileData = 'module.exports = function(app) {\n';
    entities.forEach(function(element) {
        routeFileData += `\trequire('./models/`+element.name+`/`+element.name+`.routes')(app);\n`
    }, this);
    routeFileData += '};'
    fs.writeFile("./app/app.routes.js", routeFileData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Created app.routes.js");
    }); 
}

function createDatabaseConnectionFile() {
    var databaseConnectionFile = `var dbConfig = require('../../config/database.config.js');
var mongoose = require('mongoose');    
module.exports = function(app) {
    mongoose.connect(dbConfig.url, {
        promiseLibrary: global.Promise
    });
};
    `;
    fs.writeFile("./app/models/database.connect.js", databaseConnectionFile, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Created database.connect.js");
    });
}

function createControllers() {
    entities.forEach(function(element) {
        var controllerData = `var `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` = require('./`+element.name+`.model');

exports.create = function(req, res) {
    // Create and Save a new `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`
    if (!req.body.content) {
        res.status(400).send({ message: '`+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` can not be empty' });
    }
    var `+element.name+` = new `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`({
        title: req.body.title || 'Untitled `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`',
        content: req.body.content
    });

    `+element.name+`.save(function(err, data) {
        console.log(data);
        if (err) {
            console.log(err);
            res
            .status(500)
            .send({ message: 'Some error occurred while creating the `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`.' });
        } else {
            res.send(data);
        }
    });
};

exports.findAll = function(req, res) {
    // Retrieve and return all `+element.name+`s from the database.
    `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`.find(function(err, `+element.name+`s) {
    if (err) {
        res
        .status(500)
        .send({ message: 'Some error occurred while retrieving `+element.name+`s.' });
    } else {
        res.send(`+element.name+`s);
    }
    });
};

exports.findOne = function(req, res) {
    // Find a single `+element.name+` with a `+element.name+`Id
    `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`.findById(req.params.`+element.name+`Id, function(err, data) {
    if (err) {
        res
        .status(500)
        .send({
            message: 'Could not retrieve `+element.name+` with id ' + req.params.`+element.name+`Id
        });
    } else {
        res.send(data);
    }
    });
};

exports.update = function(req, res) {
    // Update a `+element.name+` identified by the `+element.name+`Id in the request
    `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`.findById(req.params.`+element.name+`Id, function(err, `+element.name+`) {
    if (err) {
        res
        .status(500)
        .send({
            message: 'Could not find a `+element.name+` with id ' + req.params.`+element.name+`Id
        });
    }

    `+element.name+`.title = req.body.title;
    `+element.name+`.content = req.body.content;

    `+element.name+`.save(function(err, data) {
        if (err) {
        res
            .status(500)
            .send({
            message: 'Could not update `+element.name+` with id ' + req.params.`+element.name+`Id
            });
        } else {
        res.send(data);
        }
    });
    });
};

exports.delete = function(req, res) {
    // Delete a `+element.name+` with the specified `+element.name+`Id in the request
    `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`.remove({ _id: req.params.`+element.name+`Id }, function(err, data) {
    if (err) {
        res
        .status(500)
        .send({ message: 'Could not delete `+element.name+` with id ' + req.params.id });
    } else {
        res.send({ message: '`+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` deleted successfully!' });
    }
    });
};
`;
        fs.writeFile("./app/models/"+element.name+"/"+element.name+".controller.js", controllerData, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Created "+element.name+".controller.js");
        });
    }, this);
}

function createRoutes() {
    entities.forEach(function(element) {
        var routesData = `module.exports = function(app) {
var `+element.name+`s = require('./`+element.name+`.controller.js');

    // Create a new `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`
    app.post('/`+element.name+`s', `+element.name+`s.create);

    // Retrieve all `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`s
    app.get('/`+element.name+`s', `+element.name+`s.findAll);

    // Retrieve a single `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` with `+element.name+`Id
    app.get('/`+element.name+`s/:`+element.name+`Id', `+element.name+`s.findOne);

    // Update a `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` with `+element.name+`Id
    app.put('/`+element.name+`s/:`+element.name+`Id', `+element.name+`s.update);

    // Delete a `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+` with `+element.name+`Id
    app.delete('/`+element.name+`s/:`+element.name+`Id', `+element.name+`s.delete);
};`;
        fs.writeFile("./app/models/"+element.name+"/"+element.name+".routes.js", routesData, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Created "+element.name+".routes.js");
        });
    }, this);
}

function createModels() {
    entities.forEach(function(element) {
        var modelData = `var mongoose = require('mongoose');

var `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`Schema = mongoose.Schema(
    `+JSON.stringify(element.fields).replace(/"/g,'')+`,
    {
        timestamps: true
    }
);

module.exports = mongoose.model('`+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`', `+element.name.charAt(0).toUpperCase()+element.name.substr(1).toLowerCase()+`Schema);`;
        fs.writeFile("./app/models/"+element.name+"/"+element.name+".model.js", modelData, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Created "+element.name+".model.js");
        });
    }, this);
}

function createServer() {
    var serverData = `var express = require('express');
    var bodyParser = require('body-parser');
    var dbconnection = require('./app/models/database.connect');
    
    // create express app
    var app = express();
    
    // connect to database
    dbconnection();
    
    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // parse requests of content-type - application/json
    app.use(bodyParser.json());
    
    // adding all the routes
    require('./app/app.routes')(app);
    
    // define a simple route
    app.get('/', function(req, res) {
      res.send('Thanks for downloading NArchaic');
    });
    
    // listen for requests
    app.listen(`+port.PORT+`, function() {
      console.log('Server is listening on port `+port.PORT+`');
    });
    `;
    fs.writeFile("./servertest.js", serverData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Created server.js");
    });
}

createFolderStructure();
createAppRoute();
createDatabaseConnectionFile();
createControllers();
createRoutes();
createModels();
createServer();

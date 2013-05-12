couchdb-utils
=====

Create a database if it doesn't exist:

	var cradle = require('cradle'),
	    cutils = require('couchdb-utils');

    var db = new (cradle.Connection)().database('my-db');
	
	db.createIfNotExists(function(err, exists) {
        if (!err && !exists) console.log('The database has been successfully created.');
    });

Manage versioning and updates of couchdb design documents: (based on [grave](https://github.com/substack/node-grave) project).

	var cradle = require('cradle'),
	    cutils = require('couchdb-utils');

    var db = new (cradle.Connection)().database('my-database');
    var design = new cutils.Design(db, 'my-view', '0.0.2');
    
    design.view('all', {
        map : function (doc) {
            if (doc.type === 'my-doc') emit(doc._id, 1);
        },
    });
    
    design.end(function(err) {
		console.log('all views are up-to-date');
	});

Design views, lists and updates
=======

db.design(name, version)
------------------------

Start a design with a `name` and a `version`.
The`version` should be understood by
[semver](https://github.com/isaacs/node-semver).

design.view(name, view)
-----------------------

Define a couchdb view. CouchDB views have `map`, `reduce`, and fields of that
sort.

design.list(name, list)
-----------------------

Define a couchdb list. CouchDB lists are functions that look like
`function (head, req) { /* ... */ }`.

design.update(name, update)
---------------------------

Define a couchdb update. These look like `function (doc, req) { /* ... */ }`.

design.end(callback)
--------------

Declare the end of the design document definitions and save them to couchdb when
the design version is greater than the couchdb version.

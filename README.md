couchdb-utils
=====

Installation
------------

To install via NPM type the following: `npm install couchdb-utils`

You can also install via git by cloning: `git clone https://github.com/paseek/couchdb-utils.git /path/to/your/dir`


Usage
-----

Create a database if it doesn't exist:

    var cradle = require('cradle'),
        cutils = require('couchdb-utils');

    var db = new (cradle.Connection)().database('my-db');
	
    db.createIfNotExists(function(err, existed) {
        if (!err && !existed) console.log('The database has been successfully created.');
    });

Manage versioning and updates of couchdb design documents: (based on [grave](https://github.com/substack/node-grave) project).

    var cradle = require('cradle'),
        cutils = require('couchdb-utils');

    var db = new (cradle.Connection)().database('my-database');
    var design = new cutils.Design(db, 'my-view', '0.0.2');
    
    design.view('all', {
        map : function (doc) {
            if (doc.type === 'my-doc') emit(doc._id, 1);
        }
    });
    
    design.end(function(err) {
        console.log('all views are up-to-date');
    });

Design views, lists and updates
-------------------------------

**new Design(db, name, version)**

Create a design with a `name` and a `version`.
`db` is an instance of cradle.Database.
The`version` should be understood by
[semver](https://github.com/isaacs/node-semver).

    var cradle = require('cradle'),
        cutils = require('couchdb-utils');

    var db = new (cradle.Connection)().database('my-database');
    var design = new cutils.Design(db, 'my-view', '0.0.2');

**design.view(name, view)**

Define a couchdb view. CouchDB views have `map`, `reduce`, and fields of that
sort.

    design.view('all', {
        map : function (doc) {
            if (doc.type === 'my-doc') emit(doc._id, 1);
        }
    });
    
**design.list(name, list)**

Define a couchdb list. CouchDB lists are functions that look like
`function (head, req) { /* ... */ }`.

**design.update(name, update)**

Define a couchdb update. These look like `function (doc, req) { /* ... */ }`.

**design.end(callback)**

Declare the end of the design document definitions and save them to couchdb when
the design version is greater than the couchdb version.

    design.end(function(err) {
        console.log('all views are up-to-date');
    });

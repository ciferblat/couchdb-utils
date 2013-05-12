var cradle = require('cradle'),
    semver = require('semver');

var exports = module.exports;

var Database = cradle.Database;

Database.prototype.createIfNotExists = function(callback) {
    this.exists(function(err, exists) {
        if (err) {
            callback(err)
        } else {
            if (exists) {
                callback(null, exists)
            } else {
                this.create(function(err) {
                    callback(err, exists);
                });
            }
        }
    })
}

var Design = exports.Design = function(db, name, version) {
    this.db = db;
    this.name = name;

    this.document = {
        _id: '_design/' + name,
        version: version,
    };

    if (!semver.valid(version)) {
        throw new Error(
            'Invalid version in design document '
                + JSON.stringify(name)
                + ' : '
                + JSON.stringify(version)
        );
    }
};

Design.prototype.view = function(name, doc) {
    if (!this.document.views) this.document.views = {};
    this.document.views[name] = doc;
};

Design.prototype.list = function(name, doc) {
    if (!this.document.lists) this.document.lists = {};
    this.document.lists[name] = doc;
};

Design.prototype.update = function(name, doc) {
    if (!this.document.updates) this.document.updates = {};
    this.document.updates[name] = doc;
};

Design.prototype.end = function(callback) {
    var cb = callback ? callback : function(err) {
        if (err) console.error(err.stack ? err.stack : err);
    };

    var db = this.db;
    var name = this.name;
    var doc = this.document;

    db.get('_design/' + name, function(e, ex) {
        if (ex && !semver.valid(ex.version)) {
            cb(new Error(
                'Invalid version in database view '
                    + JSON.stringify(name)
                    + ' : '
                    + JSON.stringify(ex.version)
            ));
        }
        else if (e && e.error === 'not_found') {
            db.save(doc._id, doc, cb);
        }
        else if (e) {
            cb(e);
        }
        else if (semver.gt(ex.version, doc.version)) {
            cb('Rollbacks not yet implemented');
        }
        else if (semver.gt(doc.version, ex.version)) {
            db.save(doc._id, doc, cb);
        }
    });
};

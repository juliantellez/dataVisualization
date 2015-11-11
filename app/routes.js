var Subjects = require('./models/SubjectViews');

module.exports = function(app) {

    // SERVER ROUTES :::::::::::::::::::::::::::::::::::::::
    // routes to the database
    // authentication routes  
    // 'api' handling
    app.get('/api/data', function(req, res) {
    // get all data from the database
        Subjects.find({}, {    
        }, function(err, subjectDetails) {
            if (err)
                res.send(err);
            res.json(subjectDetails); // return all in JSON format
        });
    });
    // CLIENT SIDE ROUTES ::::::::::::::::::::::::::::::::::::::
    app.get('*', function(req, res) {
        res.sendfile('./public/login.html');
    });
}

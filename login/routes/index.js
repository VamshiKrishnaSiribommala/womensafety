var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', session: req.session });
});

/* POST login */
router.post('/login', function(request, response, next) {
    var user_email_address = request.body.email; // Match frontend form
    var user_password = request.body.password; // Match frontend form

    if (user_email_address && user_password) {
        let query = `SELECT * FROM users WHERE email = "${user_email_address}"`;

        database.query(query, function(error, data) {
            if (error) {
                console.error('Database error:', error);
                response.status(500).send('Database error');
                return;
            }

            if (data.length > 0) {
                if (data[0].password === user_password) { // Check password
                    request.session.user_id = data[0].id; // Match column name
                    response.redirect("/");
                } else {
                    response.send('Incorrect Password');
                }
            } else {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    } else {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }
});

/* GET logout */
router.get('/logout', function(request, response, next) {
    request.session.destroy();
    response.redirect("/");
});

module.exports = router;

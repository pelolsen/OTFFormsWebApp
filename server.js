const express = require('express')
const app = express()
const flash = require('express-flash') // Display flash messages in the frontend
const session = require('express-session') //Create a local-session
const res = require('express/lib/response')
const methodOverride = require("method-override") //To override Post method with Delete
const path = require('path');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('view-engine', 'ejs')
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(methodOverride('_method'))

// http://localhost:3000/
app.get('/', function(req, res) {
	// Render login template
	//response.sendFile(path.join(__dirname + '/login.html'));
    res.render('login.ejs')
});

const uthkeycheck = require('./models/postLogin')

app.post('/auth', async function(req,res){
    const logininfo = {
        Username: req.body.username,
        Password: req.body.password
    };
    const auth = await uthkeycheck(logininfo)
    console.log(auth);
    if (auth.check == "true") {
        // Authenticate the user
        req.session.loggedin = true;
        req.session.username = auth.data.User.FirstName + ' ' + auth.data.User.LastName;
        req.session.authkey = auth.data.AccessToken
        // Redirect to home page
        res.redirect('/home');
    } else {
        res.send('Incorrect Username and/or Password!');
    }			
    res.end();
})
/*
// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
*/
// http://localhost:3000/home
app.get('/home', function(req, res) {
	// If the user is loggedin
	if (req.session.loggedin) {
		// Output username
        res.render('home.ejs', {name: req.session.username})
		//response.send('Welcome back, ' + request.session.username + '! ' + 'Your Access Token is: ' + request.session.authkey);
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
});

app.delete('/logout', async (req,res) => {
    req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.redirect('/')
        }
      });
})

app.get('/searchclientci', function(req, res) {
    	// If the user is loggedin
	if (req.session.loggedin) {
		// Output username
        res.render('clientsearch.ejs', {name: req.session.username})
		//response.send('Welcome back, ' + request.session.username + '! ' + 'Your Access Token is: ' + request.session.authkey);
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
});
const getClient = require('./models/getClient')
app.post('/clientsearchCI', async function(req, res) {
    // If the user is loggedin
if (req.session.loggedin) {
    const salesa = req.session.username
    const auth = req.session.authkey
    console.log(auth);
    const email = req.body.clientid
    const data = await getClient(email,auth)
    const client = data.data
    if (data.check == "true") {
        for (const key in client){
            if(client[key]== null){
                client[key] = "";
            }
        }
        // Redirect to home page
        res.redirect('/ciform?data=' + encodeURIComponent(JSON.stringify(client)));
    } else {
        res.send('Incorrect Username and/or Password!');
    }

    //response.send('Welcome back, ' + request.session.username + '! ' + 'Your Access Token is: ' + request.session.authkey);
} else {
    // Not logged in
    res.send('Please login to view this page!');
}
res.end();
});

app.get('/ciform', function(req,res){
    const clientdata = JSON.parse(req.query.data)
    const sa = req.session.username
    const firstname = clientdata.firstname
    const lastname = clientdata.lastname
    const gender = clientdata.gender
    const phone = clientdata.phone
    const birthday = clientdata.birthday
    const email = clientdata.email
    console.log(clientdata);
    res.render('ciform.ejs', {firstname: firstname, lastname: lastname, gender: gender, phone: phone, birthday:birthday, email:email, sa: sa})
})

app.post('/ciform', function(req, res){
    const name= req.body.FirstName + req.body.LastName
    const email = req.body.email
    const address = req.body.StreetName + ', ' + req.body.Zip + ' ' + req.body.City
    const gender = req.body.Gender
    const birthday = req.body.birthday
    const assignedsa = req.body.assignedsa
    const findingmethod = req.body.findingmethod
    const job = req.body.job
    const notescl = req.body.notescl
    const training = req.body.training
    const injuries = req.body.injuries
    const realisticgoal = req.body.realisticgoal
    const subgoals = req.body.subgoals
    const dreamgoal = req.body.dreamgoal
    const goalswhy = req.body.goalswhy
    const weightnow = req.body.weightnow
    const musclenow = req.body.musclenow
    const fatnow = req.body.fatnow
    const weightdream = req.body.weightdream
    const muscledream = req.body.muscledream
    const fatdream = req.body.fatdream
    const pschedule = req.body.pschedule
    const trainingbudy = req.body.trainingbody

    
})

test123

app.listen(3000);
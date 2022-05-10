const express = require('express')
const app = express()
const session = require('express-session') //Create a local-session
const res = require('express/lib/response')
const methodOverride = require("method-override") //To override Post method with Delete
const path = require('path');
const { PDFNet } = require('@pdftron/pdfnet-node')
const fs = require('fs')
const PDFTronLicense = require('./node_modules/@pdftron/pdfnet-node-samples/samples/LicenseKey/LicenseKey')
const pdf2base64 = require('pdf-to-base64');

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
    const id =clientdata.id
    console.log(id);
    res.render('ciform.ejs', {id: id, firstname: firstname, lastname: lastname, gender: gender, phone: phone, birthday:birthday, email:email, sa: sa})
})

app.post('/ciform', async function(req, res){
    const auth = req.session.authkey
    const id = req.body.id
    const FirstName= req.body.FirstName
    const name= req.body.FirstName + req.body.LastName
    const email = req.body.Email
    const address = req.body.StreetName + ', ' + req.body.Zip + ' ' + req.body.City
    const gender = req.body.Gender
    const phone = req.body.phone
    const birthday = req.body.birthday
    const assignedsa = req.body.assignedsa
    const weigh = req.body.weigh
    const findingmethod = req.body.findingmethod
    const job = req.body.job
    const notescl = req.body.notescl
    const training = req.body.training
    const injuries = req.body.injuries
    const realisticgoal = req.body.realisticgoal
    const subgoals = req.body.subgoals
    const dreamgoal = req.body.dreamgoal
    const goalswhy = req.body.goalswhy
    const weighnow = req.body.weighnow
    const musclenow = req.body.musclenow
    const fatnow = req.body.fatnow
    const weighdream = req.body.weighdream
    const muscledream = req.body.muscledream
    const fatdream = req.body.fatdream
    const pschedule = req.body.pschedule
    const trainingbudy = req.body.trainingbudy
    const d = new Date();
    const datenu = d.getDate() + "-" + (d.getMonth()+1) +"-"+ d.getFullYear()

    console.log("This is the POST ID:" + id);


    const main = async () =>{
        const inputPath = './public/files/';
        const outputPath = inputPath + 'Output/';
        try {
            const inputFilename = 'CI2022.pdf';
            const outputFilename = `${FirstName}-CI-${datenu}.pdf`;
    
            const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath + inputFilename);
            doc.initSecurityHandler();
    
            const replacer = await PDFNet.ContentReplacer.create();
            const page = await doc.getPage(1);
            await replacer.addString('date', datenu);
            await replacer.addString('assignedsa', assignedsa);
            await replacer.addString('name', name);
            await replacer.addString('gender', gender);
            await replacer.addString('telephone', phone);
            await replacer.addString('address', address);
            await replacer.addString('birthday', birthday);
            await replacer.addString('email', JSON.stringify(email));
            await replacer.addString('findingmethod', findingmethod);
            await replacer.addString('job', job);
            await replacer.addString('notescl', notescl);
            await replacer.addText(await PDFNet.Rect.init(210, 450, 575, 540), training);
            await replacer.addText(await PDFNet.Rect.init(210, 400, 575, 440), injuries);
            await replacer.addText(await PDFNet.Rect.init(210, 260, 310, 310), realisticgoal);
            await replacer.addText(await PDFNet.Rect.init(210, 190, 310, 240), dreamgoal);
            await replacer.addText(await PDFNet.Rect.init(312, 190, 435, 285), subgoals);
            await replacer.addText(await PDFNet.Rect.init(445, 190, 570, 285), goalswhy);
            await replacer.addString('weighnow', weighnow);
            await replacer.addString('musclenow', musclenow);
            await replacer.addString('fatnow', fatnow);
            await replacer.addString('weighdream', weighdream);
            await replacer.addString('muscledream', muscledream);
            await replacer.addString('fatdream', fatdream);
            await replacer.addString('pschedule', pschedule);
            await replacer.addString('trainingbudy', trainingbudy);
            
            
            await replacer.process(page);
    
            await doc.save(outputPath + outputFilename, PDFNet.SDFDoc.SaveOptions.e_remove_unused);
    
            console.log('Done. Result saved in ' + outputFilename);
          } catch (err) {
            console.log(err);
            res.send('there was a problem')
          }
    }
    await PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function(error){console.log('Error: ' + JSON.stringify(error));}).then(function(){return PDFNet.shutdown();});
    const postDoc = require('./models/postDocument')
    const tobase = async (id, name, auth) =>{
        try{
            pdf2base64(`./public/files/Output/${FirstName}-CI-${datenu}.pdf`)
            .then(
                (response) => {
                    const data ={
                        ClientId: id,
                        File: {
                          FileName: `${name}-CI`,
                          MediaType: "application/pdf",
                          Buffer: response
                        }
                    }
                    postDoc(data, auth)
                }
            ).catch(
                (err) =>{
                    console.log('there was a mistake');
                    res.send('there was a problem')
                    //console.log(err);
                }
            )
        } catch {
            console.log('nono');
            res.send('there was a problem')
        }
    }
    try{
        await tobase(id, FirstName, auth);
        res.redirect('/formuploaded')
    } catch{
        res.redirect('/erroruploading')
    }
/*
//data til at gemme formen på session
const data = {
    FormName: navn,
    FormType: CI
    FormData:{
        altdata her
    }
}
//når den så gemmes i session, kan den re-render den på formens ejs.
*/
}) 

app.get('/formuploaded', function (req,res){
    res.render('formuploaded.ejs')
})
app.get('/download', function(req, res){
    const file = `${__dirname}/public/files/Output/TestForm.pdf`;
    res.download(file); // Set disposition and send it.
    res.render('errordownload.ejs')
  });
/*
app.post('/uploadpdf', async function(req, res){
    const postDoc = require('./models/postDocument')
    const auth= req.body.auth
    console.log(auth);
    pdf2base64('./public/files/Output/TestForm.pdf')
    .then(
        (response) => {
            const data ={
                ClientId: '100014629',
                File: {
                  FileName: `testendpoint-CI`,
                  MediaType: "application/pdf",
                  Buffer: response
                }
            }
            postDoc(data, auth)
        }
    ).catch(
        (err) =>{
            console.log('there was a mistake');
            console.log(err);
        }
    )
})
*/

app.listen(3000);






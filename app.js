// App.js

//  SETUP
var express = require('express');   // Use express library for the web server
var app     = express();            
PORT        = 9682;                 // Set port number 

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         

// INDEX
app.get('/', (req, res) => {
    res.render('index');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//DONOR
app.get('/donors', function(req, res){ 
    let query1;
    if (req.query.name === undefined){
        query1 = "SELECT * FROM Donors;";
    }
    else {
        query1 = `SELECT * FROM Donors WHERE name LIKE "${req.query.name}%"`
    }
    db.pool.query(query1, function(error, rows, fields){
        res.render('donors', {data: rows});
    })
});

///////////////////////////

app.post('/add-donor-form', function(req, res){
    
    let data = req.body;
    // Capture NULL values
    let donated = parseInt(data['input-donated']);
    if (isNaN(donated)){
        donated = '0'
    }
    let email = parseInt(data['input-email']);
    if (isNaN(email)){
        email = 'NULL'
    }
    query1 = `INSERT INTO Donors (name, email, total_donated) VALUES ('${data['input-name']}', '${data['input-email']}', ${donated});`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/donors');
        }
    })
});

///////////////////////////

app.delete('/delete-donor-ajax/', function(req,res,next){                                                                
    let data = req.body;
    let personID = parseInt(data.donor_id);
    let deleteDonor = `DELETE FROM Donors WHERE donor_id = '${personID}'`;
        db.pool.query(deleteDonor, [personID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
  });

///////////////////////////

app.post('/update-donor', function(req,res){
    let data = req.body;

    // capture Null values 

    let query1;

    let noName = req.body.update_donor_name
    let noEmail = req.body.update_donor_email

    if (noName.length == 0){
        query1 = `UPDATE Donors SET email = '${data.update_donor_email}' WHERE donor_id = '${data.donor_id}'`;
    }
    else if (noEmail.length == 0){
        query1 = `UPDATE Donors SET name = '${data.update_donor_name}' WHERE donor_id = '${data.donor_id}'`;
    }
    else{
        query1 = `UPDATE Donors SET name = '${data.update_donor_name}', email = '${data.update_donor_email}' WHERE donor_id = '${data.donor_id}'`;
    }
    
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400)}});
    res.redirect('/donors')
});

////////////////////////////////////////////////////////////////////////////////////////////////////////

//DONATION

app.get('/donations', function(req, res){ 
    let query1;

    if (req.query.inputDonorID === undefined){
        query1 = 'SELECT * FROM Donations;';
    }
    else if (req.query.inputDonorID === ""){
        query1 = 'SELECT * FROM Donations;';
    }
    else {
        query1 = `SELECT * FROM Donations WHERE donor_id = ${req.query.inputDonorID}`;
    }


   // Query 2 is the same in both cases
   let query2 = "SELECT * FROM Donors;";
   let query3 = "SELECT * FROM Charities;";

   // Run the 1st query
   db.pool.query(query1, function(error, rows, fields){
       
       // Save the people
       let donations = rows;
       
       // Run the second query
       db.pool.query(query2, (error, rows, fields) => {
           
           // Save the planets
           let donors = rows;

           db.pool.query(query3, (error, rows, fields) => {

            let charities = rows

           return res.render('donations', {data: donations, donors: donors, charities: charities});
       })
    })
})
});


///////////////////////////

app.post('/add-donation-form', function(req, res){
    
    let data = req.body;
   
    let amount = parseInt(data['input-amount']);
  

    query1 = `INSERT INTO Donations (donor_id, charity_id, amount, type, date) VALUES ('${data['input-donor-id']}', '${data['input-charity-id']}', '${amount}', '${data['input-donation-type']}', '${data['input-date']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/donations');
        }
    })
});

///////////////////////////

app.delete('/delete-donation-ajax/', function(req,res,next){                                                                
    let data = req.body;
    let donationID = parseInt(data.donation_id);
    let deleteDonation = `DELETE FROM Donations WHERE donation_id = '${donationID}'`;
        db.pool.query(deleteDonation, [donationID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/charities', function(req, res){ 

    let query1;

    if (req.query.inputCharityName === undefined){
        query1 = "SELECT * FROM Charities;";
    }
    else {
        query1 = `SELECT * FROM Charities WHERE name LIKE "${req.query.inputCharityName}%"`
    }
    db.pool.query(query1, function(error, rows, fields){
        res.render('charities', {data: rows});
    })
});

///////////////////////////

app.post('/add-charity-form', function(req, res){
    
    let data = req.body;
    // Capture NULL values
    let totalRaised = parseInt(data['input-totalRaised']);

    if (isNaN(totalRaised)){
        totalRaised = '0'
    }
    
    query1 = `INSERT INTO Charities (name, location, total_raised) VALUES ('${data['input-charityName']}', '${data['input-location']}', ${totalRaised})`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/charities');
        }
    })
});

///////////////////////////

app.post('/update-charity', function(req,res){

    let data = req.body;
    let query1;
   
    let Name = req.body.update_charity_name
    let Location = req.body.update_charity_location
    let TotalRaised = parseInt(data['update_total_raised']);

    ////////////////////////////////////////////////////////
    // Super redundant code.. not proud of it but it works//
    ////////////////////////////////////////////////////////

    // if not updating name 
    if (Name.length == 0){
        // if not updating name or total
        if (isNaN(TotalRaised)){
            // only updating location 
            query1 = `UPDATE Charities SET location = '${Location}' WHERE charity_id = '${data.charity_id}'`;
        } 
        // if not updating name OR location
        else if (Location.length == 0){
            // only update total_raised
            query1 = `UPDATE Charities SET total_raised = '${TotalRaised}' WHERE charity_id = '${data.charity_id}'`;
        }
        // if not updating name 
        else {
            // update location AND total_raised 
            query1 = `UPDATE Charities SET location = '${Location}', total_raised = '${TotalRaised}' WHERE charity_id = '${data.charity_id}'`;
        }
    }
    // if not updating location
    else if  (Location.length == 0) {
        // if not updating name OR location  
        if (Name.length == 0){
            // only update total_raised
            query1 = `UPDATE Charities SET total_raised = '${TotalRaised}' WHERE charity_id = '${data.charity_id}'`;
        }
        // if not updating name OR total_raised 
        else if (isNaN(TotalRaised)) {
            // only update name 
            query1 = `UPDATE Charities SET name = '${Name}' WHERE charity_id = '${data.charity_id}'`;
        }
        else {
            // update name AND total raised 
            query1 = `UPDATE Charities SET total_raised = '${TotalRaised}', name = '${Name}' WHERE charity_id = '${data.charity_id}'`;
        }
    }
    // if not updating total_raised
    else if (isNaN(TotalRaised)){
        // if not updating total_raised OR location 
        if (Location.length == 0) {
            // on;y update name 
            query1 = `UPDATE Charities SET name = '${Name}' WHERE charity_id = '${data.charity_id}'`;
        }
        // if not updating total_raised OR name 
        else if (Name.length == 0){
            // only update location 
            query1 = `UPDATE Charities SET location = '${Location}' WHERE charity_id = '${data.charity_id}'`;
        }
        else{
            // update location AND name 
            query1 = `UPDATE Charities SET location = '${Location}', name = '${Name}' WHERE charity_id = '${data.charity_id}'`;
        }
    }
    // updating all three fields 
    else {
        query1 = `UPDATE Charities SET name = '${Name}', location = '${Location}', total_raised = '${TotalRaised}'  WHERE charity_id = '${data.charity_id}'`;
    }
    
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400)}});
    res.redirect('/charities')
});

///////////////////////////

app.delete('/delete-charity-ajax/', function(req,res,next){                                                                
    let data = req.body;
    let charityID = parseInt(data.charity_id);
    let deleteCharity = `DELETE FROM Charities WHERE charity_id = '${charityID}'`;
        db.pool.query(deleteCharity, [charityID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/projects', function(req, res){ 
    let query1;

    if (req.query.input_name === undefined){
        query1 = "SELECT * FROM Projects;";
    }
    else {
        query1 = `SELECT * FROM Projects WHERE name LIKE "${req.query.input_name}%"`
    }
    db.pool.query(query1, function(error, rows, fields){
        res.render('projects', {data: rows});
    })
});

///////////////////////////

app.post('/add-project-form', function(req, res){
    let data = req.body;

    let amountNeeded = parseInt(data['input-amountNeeded']);
    let amountRaised = parseInt(data['input-amountRaised']);

    if (isNaN(amountNeeded)){
        amountNeeded = '0'
    }
    if (isNaN(amountRaised)){
        amountRaised = '0'
    }
    let query1 = `INSERT INTO Projects (name, amount_needed, amount_raised) VALUES ('${data['input-Pname']}', ${amountNeeded}, ${amountRaised})`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/projects');
        }
    })
});

///////////////////////////

app.post('/update-project', function(req,res){
    let data = req.body;

    // capture Null values 

    let query1;

    let Name = req.body.update_project_name
    let amountNeeded = parseInt(data['update_amount_needed']);
    let amountRaised = parseInt(data['update_amount_raised']);

    ///////////////////////////////////////////////////////////////////////////
    // again, mirrors the super redundant code.. not proud of it but it works//
    ///////////////////////////////////////////////////////////////////////////

    // if not updating name 
    if (Name.length == 0){
        // if not updating name OR amount_needed
        if (isNaN(amountNeeded)){
            // update only amount_raised
            query1 = `UPDATE Projects SET amount_raised = '${amountRaised}' WHERE project_id = '${data.project_id}'`;
        } 
        // if not updating name OR amount_raised
        else if (isNaN(amountRaised)){
            // update ONLY amount_needed
            query1 = `UPDATE Projects SET amount_needed = '${amountNeeded}' WHERE project_id = '${data.project_id}'`;
        }
        // if not updating name 
        else {
            // update amount_needed AND amount_raised 
            query1 = `UPDATE Projects SET amount_needed = '${amountNeeded}', amount_raised = '${amountRaised}' WHERE project_id = '${data.project_id}'`;
        }
    }
    // if not updating amount_needed
    else if (isNaN(amountNeeded)){
        if (Name.length == 0){
            query1 = `UPDATE Projects SET amount_raised = '${amountRaised}' WHERE project_id = '${data.project_id}'`;
        }
        else if (isNaN(amountRaised)) {
            query1 = `UPDATE Projects SET name = '${Name}' WHERE project_id = '${data.project_id}'`;
        }
        else {
            query1 = `UPDATE Projects SET amount_raised = '${amountRaised}', name = '${Name}' WHERE project_id = '${data.project_id}'`;
        }
    }
    // if not updating amount_raised
    else if (isNaN(amountRaised)){
        if (isNaN(amountNeeded)){
            query1 = `UPDATE Projects SET name = '${Name}' WHERE project_id = '${data.project_id}'`;
        }
        else if (Name.length == 0){
            query1 = `UPDATE Projects SET amount_needed = '${amountNeeded}' WHERE project_id = '${data.project_id}'`;
        }
        else{
            query1 = `UPDATE Projects SET amount_needed = '${amountNeeded}', name = '${Name}' WHERE project_id = '${data.project_id}'`;
        }
    }
    // updating all three 
    else {
        query1 = `UPDATE Projects SET name = '${Name}', amount_needed = '${amountNeeded}', amount_raised = '${amountRaised}'  WHERE project_id = '${data.project_id}'`;
    }
    
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400)}});
    res.redirect('/projects')
});


app.delete('/delete-project-ajax/', function(req,res,next){                                                                
    let data = req.body;
    let projectID = parseInt(data.project_id);
    let deleteProject = `DELETE FROM Projects WHERE project_id = '${projectID}'`;
        db.pool.query(deleteProject, [projectID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/charities_has_projects', function(req, res){ 
    let query1;

    if (req.query.inputCharityId === undefined){
        query1 = 'SELECT * FROM Charities_has_Projects';
    }
    else if (req.query.inputCharityId === ""){
        query1 = 'SELECT * FROM Charities_has_Projects';
    }
    else {
        query1 = `SELECT * FROM Charities_has_Projects WHERE Charities_charity_id = ${req.query.inputCharityId}`;
    }
   // Query 2 is the same in both cases
   let query2 = "SELECT * FROM Charities;";
   let query3 = "SELECT * FROM Projects;";

   // Run the 1st query
   db.pool.query(query1, function(error, rows, fields){

       let charitiesProjects = rows;
        // run 2nd query 
       db.pool.query(query2, (error, rows, fields) => {
   
           let charity = rows;
            // run 3rd query
           db.pool.query(query3, (error, rows, fields) => {

            let proj = rows

           return res.render('charities_has_projects', {data: charitiesProjects, charity: charity, proj: proj});
       })
    })
})
});


app.post('/add-charity-project-form', function(req, res){
    
    let data = req.body;
    let charity = parseInt(data['input-charityname']);
    let project = parseInt(data['input-project']);
  
    query1 = `INSERT INTO Charities_has_Projects (Charities_charity_id, Projects_project_id) VALUES ('${charity}', '${project}');`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/charities_has_projects');
        }
    })
});


app.delete('/delete-charities_has_projects-ajax/', function(req,res,next){                                                                
    let data = req.body;
    let CharityID = parseInt(data.Charities_charity_id);
    let deleteCharityProject = `DELETE FROM Charities_has_Projects WHERE Charities_charity_id = '${CharityID}'`;
        db.pool.query(deleteCharityProject, [CharityID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
  });


 //   LISTENER
app.listen(PORT, function(){            
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

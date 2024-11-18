const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../database');
const Patient = require('../models/Patient');

router.get('/show-patients', async (req, res)=> {


    //(patient form:name)
    //db.query("Select * from patientinfo where name = ? dob = ?", [name, dob])
    
    //****Okay, so... if name and dob matches an instance on the database, update the instance.
    //if patient form info matches a database instance, automatically load that shit onto the registry form.
    //once the nurse hits submit on the registry form, it should update that database instance, else it should create a new instance

    //query select * from patients where name = ? dob = ? etc.

    //to send info from one html to another, you could just send it through the url
    //hmm... if handling two clients (the patient terminal and the nurse terminal) then use event listeners to listen for when the patient hits submit that'll then update the nurses terminal
    //once a patient hits submit, they'll then be redirected to a page that just says "Info recieved. follow the nurses instructions". an event will also be emitted. in theory, this shouldn't also redirect the nurse to the same page

    //when patient hit submit, use post to put info into variables and then use event emitter to update registry form with the new values

    //(if youre going to use the choose function, )





    if(req.session.user){
        //if the request has a session and that session has a user, then the user is authenticated

         //dashboard is given user because we want to put the user's name somewhere on the dashboard
    try{
        const user = req.session.user;
        const patients = await Patient.getAllPatients();
        res.render('show-patients', { patients, user });
        //Hey compiler, what about this shit is not iterable??????? 
        //Are you fucking stupid????????????
        //FUCK OFF
    }
    catch (err){
        console.error('Error fetching patients: ', err.message);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
    }
    else{
        res.redirect('login'); //if the user is not authenticated, then they are sent back to the login page
    }
});


router.get('/patients/new', async (req, res)=>{
    res.render('add-patient');
});
//this adds a new patient and posts it to the database
router.post('/patients', async (req, res)=>{
    const {patient_name, brand, price} = req.body;
    const newPatient = new Patient(null, patient_name, brand, price);
        //null is there because that's where id is automatically inserted
    
    try{
        await newPatient.addPatient();
        res.redirect('/patients');
    }
    catch (err){
        console.error('Error adding patient: ' , err.message);
        res.status(500).json({ error: 'Failed to add patient' });
    }
});


//This retrieves the patient you want to edit and displays it on the view
router.get('/patients/edit/:id', async (req, res)=>{
    const patientId = req.params.id;
    try{
        const patient = await Patient.getPatientById(patientId);
        res.render('edit-patient', {patient});
    }
    catch (err){
        console.error('Error editing the patient: ' , err.message);
        res.status(500).json({ error: 'Failed to edit patient' });
    }
});
//This updates an existing patient and sends it to the mode
router.post('/patients/update/:id', async (req, res)=> {
    const patientId = req.params.id;
    const {patient_name, brand, price} = req.body;
    const updatedPatient = new Patient(patientId, patient_name, brand, price);

    try{
        await updatedPatient.updatePatient();
        res.redirect('/patients');
    }
    catch (err){
        console.error('Error updating the patient: ' , err.message);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});


//this deletes a patient
router.get('/patients/delete/:id', async (req, res)=>{
    const patientId = req.params.id;
    try{
        await Patient.deletePatient(patientId);
        res.redirect('/patients');
    }
    catch (err){
        console.error('Error deleting the patient: ' , err.message);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});






router.get('/register', (req,res)=>{
    res.render('register');
    //I have no clue why the actual fuck it was called registration instead of register
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/logout', (req,res)=>{
    res.render('logout');
    req.session.destroy();
});


router.get('/dashboard', (req,res)=>{
    if(req.session.user){
        //if the request has a session and that session has a user, then the user is authenticated

        const user = req.session.user;

        res.render('dashboard', {user}); //dashboard is given user because we want to put the user's name somewhere on the dashboard
    }
    else{
        res.redirect('login'); //if the user is not authenticated, then they are sent back to the login page
    }
});

router.post('/register', (req,res)=>{
    const {username,password} = req.body; //the reason we can get away with this is because the body will only contain two variables: user & password
    res.redirect('/login');

    bcrypt.hash(password, 10, (err, hash)=>{
        if (err){
            console.log('Password hashing error: ', err.message);
            return res.redirect('/register');
        }
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hash], (err, result)=>{ //you send the hash instead of the password for safety reasons
            if(err){
                console.log('Database insertion error: ', err.message);
                return res.redirect('/register');
            }
            //For some reason, putting res.redirect('/login'); here doesn't work????????? why??????
        }); 
    });
});

router.post('/login', async (req,res)=>{
    const {username,password} = req.body; 
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err,result)=>{
        if(err){
            console.log('Error retrieving user: ', err.message);
            return res.redirect('/login');
        }
        if(result.length === 0){
            console.log('User was not found in the database!');
            return res.redirect('/login');
        }
        const user = result[0];

         bcrypt.compare(password, user.password, (err, result)=>{
            if(result){ //if there is a result, that means the user is already logged in
                req.session.user = user;
                res.redirect('/show-patients');
            }
            else{ //if the user isn't found or is invalid, then it will redirect to the login
                console.log('ERROR: User doesn\'t exist or is invalid');
                res.redirect('/login');
            }
        });
    });
});



module.exports = router;
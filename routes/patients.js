const express = require('express');
const router = express.Router(); //The Router method is what actually creates the route
const app = express();
const db = require('../database');
const Patient = require('../models/Patient');

//
//
//BIG NOTE: DB.EXECUTE IS ONLY USED IN PATIENT.JS (AKA THE MODEL)
//          DB.QUERY IS USED IN patients.js
//          THIS IS BECAUSE DB.QUERY IS ONLY USED WHERE REQ.BODY IS USED

//NOTE: req means request and res means results




//this adds a new patient and posts it to the database

//hmm... maybe if the database doesnt find a matching record of the patient form it adds a new patient based off of info from the form.
//nah scratch that, just carry that shit from patient form to registry form and maybe add a button thats adds a new patient

router.post('/registry',  async (req, res)=>{
    const {name, dob, sex, gender, race, weight, height, visit, physician, insurance, secinsurance} = req.body;
    var hispanic, license;
    req.query.hispanic === undefined ? hispanic = 0 : hispanic = 1;
    req.query.license === undefined ? license = 0 : license = 1;
    const myPatient = new Patient(null, name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance);
        //null is there because that's where id is automatically inserted
    //if !(Patient.checkPatient(name,dob,sex,race) === 'Cannot find patient')
    //newPatient.addPatient();
    //else
    
    try{
        const query = 'SELECT * FROM patient_info WHERE name = ? AND DOB = ? AND sex = ? and race = ?';
        db.query(query, [name, dob, sex, race], (err, result) => {
            if(err) 
                throw err;
    if (result.length === 0){

                myPatient.addPatient(hispanic, license);
                res.render('Nurse-Edit_Form', {name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance, updateText: 'Patient Added to Database!'})
            }
        else{
            myPatient.editPatient(result[0].patient_id, hispanic, license);
            res.render('Nurse-Edit_Form', {name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance, updateText: 'Patient Updated!'})
        }
    }
);}
    catch (err){
        console.error('Error adding patient: ' , err.message);
        res.status(500).json({ error: 'Failed to add patient' });
    }
});
router.get('/formsubmit',  async (req, res)=>{
    //add code here that checks if the given patient is in the database
    app.use(express.json());
    const name = req.query.name;
    console.log(name);
    const dob = req.query.dob;
    const sex = req.query.sex;
    const gender = req.query.gender;
    const race = req.query.race;
    var hispanic;
    if (req.query.hispanic === 'on')
        hispanic = true;
    else hispanic = false;
    console.log(hispanic);
    const {weight, height, visit, physician, insurance, secinsurance, updateText} = "";
    var license = null;

    try{
        //for some reason i cant use this in getpatientbyform and I cant bother fixing it
        const query = 'SELECT * FROM patient_info WHERE name = ? AND DOB = ? AND sex = ? and race = ?';
            db.query(query, [name, dob, sex, race], (err, result) => {

            if (err) {
                console.log('Error retrieving user: ', err.message);
            }
            if (result.length === 0) {
                console.log('User was not found in the database!');
                result[0].hispanic === 1 ? hispanic = true : hispanic = false;
                result[0].drivers_license === 1 ? license = true : license = false;
                res.render('Nurse-Edit_Form', {name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance, updateText}); //name,dob,sex,race are different colors, but the compiler is forgiving. It links them to what they have been defined in line 46
            }

            else{
                console.log('User is in the database!');
            var h, l;
            result[0].hispanic === 1 ? h = true : h = false;
            result[0].drivers_license === 1 ? l = true : l = false;
            var patient = new Patient(null, result[0].name, result[0].DOB, result[0].sex, result[0].gender, result[0].race, h, result[0].weight, result[0].height, result[0].reason_for_visit, l, result[0].primary_physician, result[0].insurance, result[0].secondary_insurance);
        res.render('Nurse-Edit_Form', {name: `${patient.name}`, dob: `${patient.dob}`, sex: `${patient.sex}`, gender: `${patient.gender}`, race: `${patient.race}`, hispanic: h, 
            weight: `${patient.weight}`, height: `${patient.height}`, visit: `${patient.visit}`, license: l, physician: `${patient.physician}`, insurance: `${patient.insurance}`, secinsurance: `${patient.secinsurance}`, updateText});  
              }
            });} 
            
        
    catch (err){
        res.status(500).json({ error: 'Failed to get patient' });
        throw err;
    }
});
router.get('/', (req,res)=>{
    res.render('Patient_Form');
});


//this deletes a patient
//it'd be best for a nurse to instead notify a higher up about scrubbing a patient record from the database
//like, i'd rather give the power to delete records to only a small handful of people i could trust

//i could instead implement a console command that would delete a record from the database, but that would take a lot more work. I mean... 
router.get('/patients/delete/:id',  (req, res)=>{
//
//change this router.get() part to a console command in the far future. Delete a patient using patient_id
//
    const patientId = req.params.id;
    try{
         Patient.deletePatient(patientId);
        res.redirect('/patients');
    }
    catch (err){
        console.error('Error deleting the patient: ' , err.message);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

module.exports = router;
//NOTE: ADDING THIS STOPPED AN ERROR CALLED [APP.USE() REQUIRES A MIDDLEWARE FUNCTION] THAT WAS BEING SENT FROM APP.JS
//
//



//y'know, I'm finding why you gotta be good at math to do programming. You don't do a lot of math, but each piece of code is like its 
//own math equation. If you got a number wrong on any part of the equation, then everything breaks down and you have to find it.
//Finding the wrong number is like finding a broken bulb in a string of christmas lights. 

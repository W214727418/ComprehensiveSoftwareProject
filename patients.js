const express = require('express');
const router = express.Router(); //The Router method is what actually creates the route
const patient = require('../models/Patient');


//NOTE: req means request and res means results

//this retrieves all the patients
router.get('/show-patients',  (req, res)=> {
    try{
        const patients = Patient.getAllPatients();
        res.render('show-patients', {patients});
    }
    catch (err){
        console.error('Error fetching patients: ', err.message);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});


router.get('/formsubmit',  (req, res)=>{
    res.render('Nurse-Edit Form');
});
//this adds a new patient and posts it to the database

//hmm... maybe if the database doesnt find a matching record of the patient form it adds a new patient based off of info from the form.
//nah scratch that, just carry that shit from patient form to registry form and maybe add a button thats adds a new patient

router.post('/registry',  (req, res)=>{
    const {name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance} = req.body;
    const newPatient = new Patient(null, name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance);
        //null is there because that's where id is automatically inserted
    //if !(Patient.checkPatient(name,dob,sex,race) === 'Cannot find patient')
    //newPatient.addPatient();
    //else
    try{
         newPatient.addPatient();
        res.redirect('/Patient_Form');
    }
    catch (err){
        console.error('Error adding patient: ' , err.message);
        res.status(500).json({ error: 'Failed to add patient' });
    }
});


router.get('[placeholder]',  (req, res)=>{
    //add code here that checks if the given patient is in the database
    const patientName = req.params.name;
    const patientDOB = req.params.dob;
    //add the other form shit
    try{
        const patient =  Patient.getPatientByForm(patientName,patientDOB);
        //add stuff here that processes the return value (use if statement)    
    }
    catch (err){
        console.error('Error grabbing patient from database: ' , err.message);
        res.status(500).json({ error: 'Failed to get patient' });
    }
});
//This updates an existing patient and sends it to the mode
router.post('/patients/update/:id',  (req, res)=> {
    const patientId = req.params.id;
    const {patient_name, brand, price} = req.body;
    const updatedPatient = new Patient(patientId, patient_name, brand, price);

    try{
         updatedPatient.updatePatient();
        res.redirect('/patients');
    }
    catch (err){
        console.error('Error updating the patient: ' , err.message);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});


//this deletes a patient
router.get('/patients/delete/:id',  (req, res)=>{
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

const db = require('../database');
class Patient{
    constructor(patient_id, name, dob, sex, gender, race, latin, weight, height, reason_for_visit, drivers_license, primary_physician, insurance, secondary_insurance){
        this.id = patient_id;
        this.name = name;
        this.dob = dob;
        this.sex = sex;
        this.gender = gender;
        this.race = race;
        this.hispanic = latin;
        this.weight = weight;
        this.height = height;
        this.visit = reason_for_visit;
        this.license = drivers_license;
        this.physician = primary_physician;
        this.insurance = insurance;
        this.secinsurance = secondary_insurance;
    }


    
    async addPatient(hispanic, license){
        const {name, dob, sex, gender, race, weight, height, visit, physician, insurance, secinsurance} = this;

        const query = 'INSERT INTO patient_info (name, DOB, sex, gender, race, latin, weight, height, reason_for_visit, drivers_license, primary_physician, insurance, secondary_insurance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
        try{
            db.execute(query, [name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance]);
            console.log('Patient Added!');
        }
        catch (err){
            throw err;
        }
    }
    static async getPatientById(id){
        const query = 'SELECT * FROM patient_info WHERE patient_id = ?';
        try{
            const [results] = await db.execute(query, [id]);
            if (results.length === 0)
                throw 'Patient Not Found!';
            return results[0];
        }
        catch (err){
            throw err;
        }
    }
    static async getPatientByForm(name,dob,sex,race)
    {
        const query = 'SELECT * FROM patient_info WHERE name = ? AND DOB = ? AND sex = ? and race = ?';
            db.execute(query, [name, dob, sex, race], (err, result) => {

            if (err) {
                console.log('Error retrieving user: ', err.message);
            }
            if (result.length === 0) {
                console.log('User was not found in the database!');
                return null;
            }

            else
                console.log(result[0].name); //i bet this bullshit is gonna be undefined again
            var h, l;
            if (result[0].hispanic === 1)
                h = true;
            else h = false;
            result[0].drivers_license === 1 ? l = true : l = false;
            console.log('me me big boy');
            console.log(result[0].drivers_license);
            /*
            const query = 'INSERT INTO patient_info (name, DOB, sex, gender, race, latin, weight, height, reason_for_visit, drivers_license, primary_physician, insurance, secondary_insurance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
            db.execute(query,  [result[0].name, result[0].DOB, result[0].sex, result[0].gender, result[0].race, h, result[0].weight, result[0].height, result[0].reason_for_visit, l, result[0].primary_physician, result[0].insurance, result[0].secondary_insurance]);
            */

           // what did I do today? i successfully took shit from the database and into object. i dunno how to send it to router tho ehehfhfhfheehheehehehhf
             
             var brickbybrick = [result[0].name, result[0].DOB, result[0].sex, result[0].gender, result[0].race, h, result[0].weight, result[0].height, result[0].reason_for_visit, l, result[0].primary_physician, result[0].insurance, result[0].secondary_insurance];
             return brickbybrick;
            //if this doenst work then create new Patient and set paremeters to result.databasecolumn
        }
        );
    }
    

    async editPatient(id, hispanic, license){


        //update patient_info set blah blah where name = ? dob = ? sex = ? race = ?

        const {name, dob, sex, gender, race, weight, height, visit, physician, insurance, secinsurance} = this;
        const query = 'UPDATE patient_info SET name = ?, DOB = ?, sex = ?, gender = ?, race = ?, latin = ?, weight = ?, height = ?, reason_for_visit = ?, drivers_license = ?, primary_physician = ?, insurance = ?, secondary_insurance = ? WHERE patient_id = ?';
        //CHANGE THIS QUERY
        try{
            console.log(physician);
             db.execute(query, [name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance, id]);
             //
            //NOTE: YOU HAVE TO SEPARATE THE 'WHERE' PARAMETERS FROM THE OTHER PARAMETERS USING CURLY BRACKETS
            //NOTE 2: THE NOTE ABOVE IS WRONG, (bruh it took me days to figure this bullshit out. it works now...)
            console.log('Patient updated');
        }
        catch (err){
            throw err;  
        }
    }
    static async deleteDevice(id){
        const query = 'DELETE FROM devices WHERE id = ?';
        try{
            const [results] = await db.execute(query, [id]);
            if (results.affectedRows === 0)
                throw 'Device Not Found!';
        }
        catch (err){
            throw err;
        }
    }
}

module.exports = Patient;


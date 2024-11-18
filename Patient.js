const db = require('../database');

class Patient{
    constructor(id, name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance){
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.sex = sex;
        this.gender = gender;
        this.race = race;
        this.hispanic = hispanic;
        this.weight = weight;
        this.height = height;
        this.visit = visit;
        this.license = license;
        this.physician = physician;
        this.insurance = insurance;
        this.secinsurance = secinsurance;
    }


    
    async addPatient(){
        const {name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance} = this;
        const query = 'INSERT INTO devices (name, dob, sex, gender, race, latin, weight, height, reason_for_visit, drivers_license, primary_physician, insurance, secondary_insurance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
        try{
            await db.execute(query, [name, dob, sex, gender, race, hispanic, weight, height, visit, license, physician, insurance, secinsurance]);
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
    async editPatient(){
        const {id, device_name, brand, price} = this;
        const query = 'UPDATE devices SET device_name = ?, brand = ?, price = ? WHERE patient_id = ?';
        try{
            const [results] = await db.execute(query, [device_name, brand, price, id]);
            if (results.affectedRows === 0)
                throw 'Device Not Found!';
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


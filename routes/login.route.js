//console.log("test1")
import express from "express"
import connection from "../index.js"
import md5 from "md5"
//import { connection } from "mongoose";
const router = express.Router();
//const connection = require('../db');

router.route('/test').post((req,res)=>{
    console.log( "login test ")
    console.log(req.query)
    connection.query("select count(*) from user", (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
      } else {
        console.log('Current database:', typeof(results[0]['count(*)']));
      }
    });
    return res.json("hello log")
})

router.route('/register').post(async(req, res) => {
    //console.log(req)
    let idtemp=100;
    connection.query('select count(*) from user',(err,res)=>{
        console.log("counter of user",res[0]['count(*)'])
        idtemp+=res[0]['count(*)']+1
    })
    //const id=idtemp;
    //const =idtemp;
    console.log(req.query)
  const { name, password, about, type, email } = req.query;
     connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error checking for existing user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    console.log(idtemp, name, (password), about, type, email)
    connection.query('INSERT INTO user (ID, name, password, about, type, email) VALUES (?, ?, ?, ?, ?, ?)', [idtemp, name, (password), about, type, email], (err) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
}); 

router.route('/login').post((req, res) => {
  const { name, password } = req.query;

  connection.query('SELECT * FROM user WHERE name = ? AND password = ?', [name, (password)], (error, results) => {
    if (error) {
      console.error('Error checking login credentials:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid user or password' });
    }

    const user = results[0];
    

    res.status(200).json({ message: 'Login successful', user });
  });
});

export default router

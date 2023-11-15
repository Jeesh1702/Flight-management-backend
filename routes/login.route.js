import express from "express"

import { sendMessage } from "../fire.js";

import md5 from "md5"
const router = express.Router();

let connection

function injectDB(conn){
    if(connection){
        return
    }
    else{
        connection = conn
        connection.connect((err) => {
            if (err) {
              console.error('Error connecting to MySQL:', err);
            } else {
              console.log('Connected to MySQL');
              connection.query("select * from user",(error,results) => {
                if(error){
                    connection.query("CREATE TABLE user(ID varchar(20) not null,name varchar(30) not null,password varchar(100) not null,about varchar(100),type varchar(15), email varchar(30));",(error,results) => {
                        if(error){
                            console.log("Error in creating table user")
                        }
                        else{
                            console.log("Table created successfully")
                        }
                    })
                }
                else{
                    console.log("User table already present")
                }
            })}
        });
    }
}
export {injectDB}

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

router.route('/CusId').get((req,res)=>{
  console.log("customer")
  //const name
})

router.route('/register').post(async(req, res) => {
    console.log("hellow")
    // console.log(req.body)
    let idtemp=100;
     connection.query('select count(*) from user',(err,res)=>{
        console.log("counter of user",res[0]['count(*)'])
        idtemp+=res[0]['count(*)']+1
    })
    //const id=idtemp;
    //const =idtemp;
    console.log("helo")
    //console.log(req.query)
  const { name, password, about, type, email } = req.body;
     connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
      
    // if (error) {
    //   console.error('Error checking for existing user:', error);
    //   return res.status(500).json({ message: 'Internal server error' });
    // }

    // if (results.length > 0) {
    //   return res.status(400).json({ message: 'User with this email already exists' });
    // }
    // console.log( results)
    console.log(idtemp, name, (password), about, type, email)
    connection.query('INSERT INTO user (ID, name, password, about, type, email) VALUES (?, ?, ?, ?, ?, ?)', [idtemp, name, md5(password), about, type, email], (err) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
      sendMessage(name)
    });
  });
}); 

router.route('/login').post((req, res) => {
  const { name, password } = req.body;
  connection.query('SELECT * FROM user WHERE name = ? AND password = ?', [name, md5(password)], (error, results) => {
    // console.log(results)
    if (error) {
      console.error('Error checking login credentials:', error);

      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid user or password' });
    }

    const user = results[0];
    
    //res.body.id=results[0].ID
    res.status(200).json({ message: 'Login successful', user });
    sendMessage(name)
  });
});

export default router

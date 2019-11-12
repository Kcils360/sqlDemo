'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();


const superagent = require('superagent');
const pg = require('pg');

app.use(cors());

//Database connection setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

//save "cache" our single record into the db
app.get('/add', (request, response) => {
    let firstName = request.query.first;
    let lastName = request.query.last;
    let SQL = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING *';
    let safeValues = [firstName, lastName];
    client.query(SQL, safeValues)
        .then( results =>{
            response.status(200).send(results);
        })
        .catch(error => console.error(error));
})

//get retrieve all records in the db
//stretch goal ... do it with a where
app.get('/people', (req, res) => {
    let SQL = 'SELECT * FROM people';
    client.query(SQL)
    .then( results => {
        res.status(200).json(results.rows);
    })
})



app.listen(PORT, () => console.log(`Server up and listening on port ${PORT}`));
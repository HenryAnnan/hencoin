const express = require('express');
const app = express()
const PORT = 8080;
const cors = require('cors');
app.use(cors()); // allows the api to be accessed from any domain


const fs = require('fs'); // requires node.js file system
app.use(express.json()) // allows the api to read json


app.listen(PORT) // starts  up th api

app.post('/isUp', (req, res) => {
    res.status(200).send('OK');
});
// Get User data endpoint

app.post('/getData', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        async function getData() {
            const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
            return JSON.parse(data); // parse the data into a JavaScript object
        }

        const data = await getData();
        let isAdmin = false

        if (data.admin === true) {
            isAdmin = true
        }
        if (data.password === password && data.username === username) {
            res.status(200).send({
                login:true,
                admin: isAdmin,
                name : data.name,
                balance : data.Balance,
            })
        } else {
            res.status(403).send('Invalid username or password'); // send a response when the username or password don't match
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
// Admin Get data endpoint
app.post('/adminGet' , async (req, res) => {
    const body = req.body;
    const username = body.username;

    async function getData(username) {
        const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
        const parsedData = JSON.parse(data); // parse the data into a JavaScript object
        return parsedData.Balance; // return the Balance property of the parsed data
    }

    try {
        const balance = await getData(username);
        res.status(200).send({ balance: balance });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
// Admin Modify data endpoint
app.post('/modify', async (req, res) => {
    const body = req.body;
    const username = body.username;
    const method = body.method;
    const value = parseFloat(body.value); // Parse the value to a number

    if (method === 'increase'){
        async function getData(username){
            const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
            const parsedData = JSON.parse(data);
            return parseFloat(parsedData.Balance); // Parse the balance to a number
        }
        const balance = await getData(username);
        const newBalance = balance + value;

        async function updateData(username, newBalance){
            const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
            const parsedData = JSON.parse(data);
            parsedData.Balance = newBalance;
            const updatedData = JSON.stringify(parsedData);
            await fs.promises.writeFile(`./storage/${username}.json`, updatedData, 'utf8');
        }
        await updateData(username, newBalance);
        res.status(200).send({ message: 'Balance updated successfully' });
    }else if (method === 'decrease'){  async function getData(username){
        const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
        const parsedData = JSON.parse(data);
        return parseFloat(parsedData.Balance); // Parse the balance to a number
    }
        const balance = await getData(username);
        const newBalance = balance - value;

        async function updateData(username, newBalance){
            const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
            const parsedData = JSON.parse(data);
            parsedData.Balance = newBalance;
            const updatedData = JSON.stringify(parsedData);
            await fs.promises.writeFile(`./storage/${username}.json`, updatedData, 'utf8');
        }
        await updateData(username, newBalance);
        res.status(200).send({ message: 'Balance updated successfully' });
    }else if (method === 'set'){  async function getData(username){
        const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
        const parsedData = JSON.parse(data);
        return parseFloat(parsedData.Balance); // Parse the balance to a number
    }
        const balance = await getData(username);
        const newBalance = value

        async function updateData(username, newBalance){
            const data = await fs.promises.readFile(`./storage/${username}.json`, 'utf8');
            const parsedData = JSON.parse(data);
            parsedData.Balance = newBalance;
            const updatedData = JSON.stringify(parsedData);
            await fs.promises.writeFile(`./storage/${username}.json`, updatedData, 'utf8');
        }
        await updateData(username, newBalance);
        res.status(200).send({ message: 'Balance updated successfully' });
    }







});
// Add user endpoint
app.post('/addUser', async (req, res) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;
    const name = body.name;

    // Create a new user object
    const newUser = {
        username: username,
        password: password,
        name: name,
        Balance: 0,
        admin: false
    };

    // Stringify the user object into JSON
    const newUserJson = JSON.stringify(newUser);

    // Write the JSON to a new file
    try {
        await fs.promises.writeFile(`./storage/${username}.json`, newUserJson, 'utf8');
        res.status(200).send({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');

    }
});
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path'); // For handling the views folder
const axios = require('axios');

const app = express();
const port = 3000;

// Set the views folder location
app.set('views', path.join(__dirname, 'views')); // Ensure 'views' is set properly
app.set('view engine', 'pug'); // Use Pug as the template engine
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data
app.use(express.static('public')); // Static files (like CSS/JS)

// Home route - Displays the custom object data
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.hubapi.com/crm/v3/objects/contacts', 
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN}`
                }
            }
        );

        res.render('homepage', { title: 'Custom Object List', data: response.data.results });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred while fetching custom objects.');
    }
});

// Render the form to add a new custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Handle form submission to create a new custom object
app.post('/update-cobj', async (req, res) => {
    try {
        const { email, firstname, lastname, age, bio } = req.body;

        const response = await axios.post(
            'https://api.hubapi.com/crm/v3/objects/contacts', 
            {
                properties: {
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    age: age,
                    bio: bio
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Redirect to homepage after successful creation
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred while creating the custom object.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

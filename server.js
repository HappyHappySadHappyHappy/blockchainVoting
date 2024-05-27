const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Hello World");
});

// Define a route to handle the POST request
app.post('/', (req, res) => {
  const { transaction } = req.body;

  if (transaction) {
    console.log(`Received transaction: ${transaction}`);
    res.status(200).send(`Transaction received: ${transaction}`);
  } else {
    res.status(400).send('Transaction value is missing');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// Serve the client folder statically
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
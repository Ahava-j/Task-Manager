// Get 3rd Party modules
const express = require("express");

// Get Custom built modules 
//this is just importing it which can than be used to access read and write
const fm = require("./filemgr");


// Create the express http server
const app = express();

// Define some built-in middleware
app.use(express.static("./Client")); 
//.use lets you use middleware functions which have access to the request and responce obj
// express.static makes it so that the server sends files as is to the client - they dont need to be processed by server b4 sent
app.use(express.json());

// Define HTTP  routes listenting for requests
// get defines handler for GET requests which retrive data from a server
///api is the path that the hadnler will respond to
app.get("/api", async (req,res) => {
  try{
    const userReq = await fm.ReadData();
    // console.log(userReq);
    res.status(200).json(userReq);
  }
  catch(error){
    res.status(500).json({ error: 'An error occurred reading data' });
  }
})

app.post("/api", async (req,res) => {
  console.log(req.body);
  // try{
    let valid = await fm.WriteData(req.body);
    if(valid === true){
      res.status(200).json("Data written successfully");
      return;
    } 
  // }
  // catch (error){
    res.status(500).json({ error: 'An error occurred while writing data' });
  // }
})

// page not found route
app.all("*", (req,res) => {
  res.status(404).send("<h1>Page Not Found...</h1>");
});

// Create a server
const appName = "Simple List";
const port = 5050;
app.listen(port, () => {
  console.log(`App ${appName} is running on port ${port}`);
})
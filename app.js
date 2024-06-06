const express = require("express");
const connectDB = require("./connect");

const port = 8080;
const appName = "Task Manager";
const app = express();

// Middleware
app.use(express.static("./client")); 
app.use(express.json());

// Data model (schema)
const tasks = require("./Task");

// Define routes
app.get("/tm/tasks/", async (req,res)=>{
  try {
    //console.log(req.params);
    //const {pid} = req.params;

    const task = await tasks.find(); //findbyid //create //findbyidanddelete //findbyidandupdate
    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});

app.post("/tm/tasks/", async (req,res)=>{
  try {
    const task = await tasks.create({name: req.body.name, completed: req.body.completed});
    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});

app.delete("/tm/tasks/", async (req,res)=>{
  try {
    const task = await tasks.findByIdAndDelete(req.body.id);
    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});

// Connect to the database and start the node server
(async function () {
  try {
    await connectDB();
    app.listen(port, () => console.log(`${appName} is listening on port ${port}.`));
  } catch (error) {
    console.log(error);
  };
}) ();
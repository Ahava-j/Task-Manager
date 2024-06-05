const fs = require("fs/promises") // this is an object that provides methods for interacting with the file system
const filePath = "./listdata.json";

//async means will return promise
async function ReadData() {
  try {
    // Make sure the file exists
   // await fs.access(filePath, fsconstants.F_OK);

    // Read the file
    const fContent = await fs.readFile(filePath, "utf-8");

    // convert the buffer to a json object and return it
    const jsonObj = JSON.parse(fContent.toString());
    return jsonObj

  } catch (error) {
    console.error("Error reading the data:", error);
    throw error;
  }
}

async function WriteData(dataOut) {
  try {
    // Write the file
    const jsonS = JSON.stringify(dataOut);
    await fs.writeFile(filePath, jsonS, 'utf-8'); 
    // used await because it ensures that the file is fully written before the code moves on
    // so it really waits for the promise to be resolved
    return true;
  } 
  catch (error) {
    console.error("Error writing the data:", error);
    throw error;
  }
}

exports.ReadData = ReadData;
exports.WriteData = WriteData;

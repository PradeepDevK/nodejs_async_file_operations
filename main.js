const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

/**
 * Generating 10 customers
 */
function getCustomers() {
    return Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        name: `Customer_${index + 1}`,
    }));
}

/**
 * Making dummy POST call
 */
async function makePostCall(customerObj) {
    try {
        const result = await axios.post("https://jsonplaceholder.typicode.com/posts", {
            customerId: customerObj.id,
            message: "A dummy POST request from Node.JS",
        });
        return { status: "success", data: result.data };
    } catch(error) {
        return { status: "failed", error: error.message };
    }
}

async function writeToFile(customerObj, result) {
    const fileName = `customer_${customerObj.id}.txt`;
    const filePath = path.join(__dirname, "post_response", fileName);

    const content = `Timestamp: ${new Date().toISOString()} | Customer ID: ${customerObj.id} | Name: ${customerObj.name} | Status: ${result.status} | Response: ${JSON.stringify(result.data) || "None"} | Error: ${result.error || "None"}\n`;

    try {
        await fs.appendFile(filePath, content);
        console.log(`successfully written for the customer ${customerObj.id}, file: ${filePath}`);
    } catch(error) {
        console.error(`error while writing file for customer ${customerObj.id}, error: ${error.error.message}`);
    }
}

async function main() {
    const customers = getCustomers();
    console.log("Customers", customers);

    const tasks = customers.map(async (customer) => {
        const postResult = await makePostCall(customer);
        await writeToFile(customer, postResult);
    });

    await Promise.all(tasks);
    console.log("Process Completed");
}

main().catch((err) => console.error("Error in the process:", err.message));
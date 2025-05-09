import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 9876;
const windowSize = parseInt(process.env.WINDOW_SIZE) || 10;

let numStore = new Set(); //creating set for storing and getting new numbers
let numArray = [];


const calcAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a,b) => a+b, 0);
    return parseFloat((sum/numbers.length).toFixed(2));
};

const fetchNumbers = async (type) => {
    try {
        console.log(`Fetching ${type} numbers...`);
        console.log(`URL: ${process.env.BASE_URL}/${type}`);
        console.log(`Auth Token: ${process.env.AUTH_TOKEN}`);
        
        const response = await axios.get(`${process.env.BASE_URL}/${type}`, {
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
            },
            timeout: 500
        });
        
        console.log(`Response received:`, response.data);
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        return [];
    }
};

// main backend functionality and endpoint
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const valid = ['p', 'f', 'e', 'r'];
    
    if (!valid.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }
    
    const typeMap = { //using map for fast lookup
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };

    const prevState = [...numArray];
    const numbers = await fetchNumbers(typeMap[numberid]); //dynamic num fetch

    numbers.forEach(num => {
        if (!numStore.has(num)) {
            numStore.add(num);
            numArray.push(num);
        }
    });

    while (numArray.length > windowSize) {
        const removed = numArray.shift(); //shift removes from start
        numStore.delete(removed);
    }

    // giving final output as response to the request
    const response = {
        windowPrevState: prevState,
        windowCurrState: [...numArray],
        numbers: numbers,
        avg: calcAverage(numArray)
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
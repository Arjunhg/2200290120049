import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 9876;
const windowSize = parseInt(process.env.WINDOW_SIZE) || 10;

let numStore = new Set();
let numArray = [];

const calcAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a,b) => a+b, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
};


const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/${type}`, {
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
            },
            timeout: 500
        });

        if (response.data && response.data.numbers) {
            return response.data.numbers;
        }
        return [];
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error(`Request timeout for ${type} numbers`);
        } else {
            console.error(`Error fetching ${type} numbers:`, error.message);
        }
        return [];
    }
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const valid = ['p', 'f', 'e', 'r'];

    if (!valid.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const typeMap = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };

    const prevState = [...numArray];
    const numbers = await fetchNumbers(typeMap[numberid]);

    if (numbers.length > 0) {
        numbers.forEach(num => {
            if (!numStore.has(num)) {
                numStore.add(num);
                numArray.push(num);
            }
        });

        while (numArray.length > windowSize) {
            const removed = numArray.shift();
            numStore.delete(removed);
        }
    }

    const response = {
        windowPrevState: prevState,
        windowCurrState: [...numArray],
        numbers,
        avg: calcAverage(numArray)
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

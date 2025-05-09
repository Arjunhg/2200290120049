# Average Calculator HTTP Microservice

A robust microservice that calculates averages of different types of numbers (prime, Fibonacci, even, and random) while maintaining a sliding window of unique numbers.

## Features

- REST API endpoint for different number types (prime, Fibonacci, even, random)
- Sliding window implementation with configurable window size
- Duplicate number handling
- 500ms timeout for external API calls
- Real-time average calculation
- Maintains state of previous and current window

## API Endpoints

### GET /numbers/{numberid}

Fetches and processes numbers based on the specified type.

**Parameters:**
- `numberid`: Type of numbers to fetch
  - `p`: Prime numbers
  - `f`: Fibonacci numbers
  - `e`: Even numbers
  - `r`: Random numbers

**Response Format:**
```json
{
   "windowPrevState": [], // Previous state of the window
   "windowCurrState": [], // Current state of the window
   "numbers": [], // Numbers received from the API
   "avg": 0.00 // Average of current window
}
```

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=9876
WINDOW_SIZE=10
AUTH_TOKEN=your_auth_token
BASE_URL=http://20.244.56.144/evaluation-service
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Implementation Details

- Uses Express.js for the HTTP server
- Implements a sliding window algorithm
- Maintains unique numbers using Set data structure
- Handles API timeouts (500ms limit)
- Calculates running averages

## Error Handling

- Invalid number type requests return 400 status
- API timeouts are handled gracefully
- Duplicate numbers are automatically filtered
- Window size is strictly maintained

## Performance Considerations

- 500ms timeout for external API calls
- Efficient duplicate checking using Set
- Optimized average calculation
- Memory-efficient window management

## Testing

Test the API using curl:
```bash
# Get even numbers
curl http://localhost:9876/numbers/e

# Get prime numbers
curl http://localhost:9876/numbers/p

# Get Fibonacci numbers
curl http://localhost:9876/numbers/f

# Get random numbers
curl http://localhost:9876/numbers/r
```

## Requirements

- Node.js
- Express.js
- Axios
- dotenv

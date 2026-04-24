# Quiz Leaderboard System

This project solves the SRM quiz validator assignment by:
- polling the validator API exactly 10 times (`poll=0` to `poll=9`),
- enforcing a 5-second delay between polls,
- deduplicating events using the composite key `(roundId + participant)`,
- aggregating participant scores,
- generating a descending leaderboard by total score,
- submitting the leaderboard exactly once after all polls complete.

## Tech Stack

- Node.js (CommonJS)
- Axios for HTTP requests

## Project Structure

```text
Bajaj-Test/
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

Expected runtime is around 50 seconds because there are 9 required delays of 5 seconds each between 10 polls.

## Configuration

In `index.js`:
- `BASE_URL` is set to `https://devapigw.vidalhealthtpa.com/srm-quiz-task`
- `REG_NO` is set to `2024CS101`
- `DELAY_MS` is set to `5000`

If needed, replace `REG_NO` with your own registration number.

## Deduplication Logic

Each event is uniquely identified by:

```text
${roundId}_${participant}
```

A `Set` stores all seen keys. If a key already exists, that event is logged as duplicate and skipped.

## Output Behavior

During execution, the script logs:
- poll fetch progression,
- counted score events,
- duplicate-skipped events,
- final local leaderboard,
- total combined score,
- submission response from server.

## Important Rules Followed

- Poll indices are `0..9` (not `1..10`)
- 5-second wait is preserved between polls
- Submission is done once after polling completes
- Dedup key uses both `roundId` and `participant`
- Leaderboard sorting is descending by score

## Sample Output
1. Bob: 295
2. Alice: 280
3. Charlie: 260
Total combined score: 835
Server response: { regNo: '2024CS101', submittedTotal: 835, attemptCount: 120 }

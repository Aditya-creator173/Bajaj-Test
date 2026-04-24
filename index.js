const axios = require('axios');

const BASE_URL = 'https://devapigw.vidalhealthtpa.com/srm-quiz-task';
const REG_NO = '2024CS101';
const DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPoll(pollIndex) {
  const url = `${BASE_URL}/quiz/messages?regNo=${REG_NO}&poll=${pollIndex}`;
  const response = await axios.get(url);
  return response.data;
}

async function submitLeaderboard(leaderboard) {
  const url = `${BASE_URL}/quiz/submit`;
  const response = await axios.post(url, { regNo: REG_NO, leaderboard });
  return response.data;
}

async function main() {
  const seen = new Set();
  const scores = new Map();

  for (let poll = 0; poll <= 9; poll++) {
    console.log(`Fetching poll ${poll}...`);

    const data = await fetchPoll(poll);

    for (const event of data.events) {
      const key = `${event.roundId}_${event.participant}`;

      if (seen.has(key)) {
        console.log(`  DUPLICATE skipped: ${key}`);
        continue;
      }

      seen.add(key);
      const current = scores.get(event.participant) || 0;
      scores.set(event.participant, current + event.score);
      console.log(`  Counted: ${key} +${event.score}`);
    }

    if (poll < 9) {
      console.log(`Waiting ${DELAY_MS / 1000}s before next poll...`);
      await sleep(DELAY_MS);
    }
  }

  const leaderboard = Array.from(scores.entries())
    .map(([participant, totalScore]) => ({ participant, totalScore }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const totalScore = leaderboard.reduce((sum, entry) => sum + entry.totalScore, 0);

  console.log('\n=== LEADERBOARD ===');
  leaderboard.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.participant}: ${entry.totalScore}`);
  });
  console.log(`Total combined score: ${totalScore}`);

  console.log('\nSubmitting...');
  const result = await submitLeaderboard(leaderboard);
  console.log('Server response:', result);
}

main().catch(console.error);

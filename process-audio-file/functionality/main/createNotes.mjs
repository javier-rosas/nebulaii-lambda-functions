const apiKey = process.env.OPEN_AI_API_KEY;

async function callChatGPT(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

export async function createNotes(transcript) {
  transcript = JSON.stringify(transcript)
  const prompt = `Summarize the following conversation in bullet points and provide action items if appropriate:\n\n${transcript}\n\nSummary:\n-`;
  const summary = await callChatGPT(prompt);
  return summary;
}
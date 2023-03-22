import { getGptNotes } from '../main/getGptNotes.mjs'

/**
 * Creates notes from transcript.
 * @param {string} transcript audio transcript
 * @returns {string} notes
 */
export async function createNotesHandler(transcript) {
  console.log("here 6")
  transcript = JSON.stringify(transcript);
  const prompt = `Summarize the following conversation in bullet points and provide action items if appropriate:\n\n${transcript}\n\nSummary:\n-`;
  const notes = await getGptNotes(prompt);
  return notes;
}

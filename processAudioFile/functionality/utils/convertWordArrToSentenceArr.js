/**
* Converts array of word objects to array of sentence objects
* @param {Array} words array of word objects with speaker tags 
* @returns {Array} array of sentence objects in the form of:
 [
  { speakerTag: 1, "Hello, there!"},
  { speakerTag: 2, "Hey dude!"}
 ]
*/
export function convertWordArrToSentenceArr(words) {
  let sentences = [];
  let sentence = "";
  let currentSpeaker = words[0].speakerTag;

  words.forEach((word, index) => {
    if (word.speakerTag !== currentSpeaker || index === words.length - 1) {
      sentences.push({ speakerTag: currentSpeaker, sentence });
      sentence = "";
      currentSpeaker = word.speakerTag;
    }
    sentence += `${word.word} `;
  });

  let lastSentence = sentences[sentences.length - 1];
  if (
    lastSentence.sentence !== sentence &&
    lastSentence.speakerTag !== currentSpeaker
  ) {
    sentences.push({ speakerTag: currentSpeaker, sentence });
  } else if (
    lastSentence.sentence !== sentence &&
    lastSentence.speakerTag === currentSpeaker
  ) {
    lastSentence.sentence += sentence;
  }

  return sentences;
}

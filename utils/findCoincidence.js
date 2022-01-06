function splitSentence(sentence) {
  return sentence
    .toLowerCase()
    .replaceAll(",", " ")
    .split(" ")
    .filter((char) => char !== "");
}

module.exports = function findCoincidence(str1, str2) {
  str1 = splitSentence(str1);
  str2 = splitSentence(str2);

  let conciedence = 0;

  for (let i = 0; i < str1.length; i++) {
    if (str2.indexOf(str1[i]) > -1) {
      conciedence++;
    }
  }

  return conciedence;
};

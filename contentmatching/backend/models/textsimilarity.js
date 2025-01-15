const { spawnSync } = require('child_process');

// Sample database sentences
const databaseSentences = [
  "Global warming is a serious problem.",
  "Climate change affects the whole planet.",
  "We must take action against pollution.",
  "Climate change is affecting the environment.",
  "Action is needed to fight climate change."
];

function checkTextSimilarity(userInput) {
  const pythonCode = `
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
input_sentence = "${userInput.replace(/"/g, '\\"')}"
database_sentences = ${JSON.stringify(databaseSentences)}

input_embedding = model.encode(input_sentence)
database_embeddings = model.encode(database_sentences)
cosine_scores = cosine_similarity([input_embedding], database_embeddings)

highest_similarity = max(cosine_scores[0])
most_similar_sentence = database_sentences[cosine_scores[0].tolist().index(highest_similarity)]

if highest_similarity > 0.5:
    print(f"Matched! {highest_similarity*100:.2f}% - {most_similar_sentence}")
else:
    print("No significant match.")
`;

  // Execute the Python script using spawnSync
  const result = spawnSync('python', ['-c', pythonCode], { encoding: 'utf-8' });

  if (result.error) {
    return { error: 'Error executing Python script' };
  }

  const output = result.stdout.trim();
  return { result: output };
}

module.exports = { checkTextSimilarity };

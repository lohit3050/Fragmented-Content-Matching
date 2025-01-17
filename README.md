<h2>Approach :</h2>
<h3>Textsimilaritycheck:</h3>
Model used: paraphrase-MiniLM-L6-v2
<br>
This search method is based on semantic similarity. It uses cosine similarity and sentence embeddings to identify the semantically closest sentence in a database. Tasks like question-answer matching, knowledge retrieval, and paraphrase detection benefit from this approach.
<br>
Sentence embedding:
<br>
The code transforms sentences into dense vector representations (embeddings) in a high-dimensional space using the SentenceTransformer model (paraphrase-MiniLM-L6-v2).
<br>
Encoding Input and Database Sentences:
The vector (input_embedding) contains the input sentence "Climate change is real."
Additionally, a collection of vectors (database_embeddings) has the list of database phrases encoded into it.
<br>
Calculating Cosine Similarity:
<br>
The cosine similarity between each database sentence embedding and the input sentence embedding is calculated. This gauges how similar two vectors are angularly; a value of 1 indicates that they are identical.
A matrix with each item representing the similarity score between an input sentence and a database sentence is returned by cosine_similarity([input_embedding], database_embeddings).
<br>
Finding the Most Similar Sentence:
<br>
Max(cosine_scores[0]) is used to determine the highest cosine similarity score.
The matching sentence is retrieved from database_sentences using the index of this greatest score.
<br>
<br>
<h3>Imagesimilartycheck:</h3>
<br>
Technique used: Structural Similarity Index (SSIM)
<br>
Reading the image:
cv2.imread(image_path, cv2.IMREAD_GRAYSCALE) reads each image from the database directory (image_path) and the input image (user_image_path) in greyscale mode.
<br>
Resizing the Images:
Using cv2.resize(), both pictures are downsized to a fixed 300x300 pixel size.Because SSIM computation requires that both pictures have the same dimensions, this guarantees that they do.
<br>
Calculating SSIM (Structural Similarity Index):
<br>
The SSIM score is computed using skimage.metrics.structural_similarity between the resized images.
<br>
Finding the Most Similar Image:
<br>
The algorithm determines the SSIM score between each database image and the user image by iterating through all of the images in the database directory.
It records the comparable image (most_similar_image) and the highest similarity score (highest_similarity).
<br>
<br>
<h3>Libraries :</h3>
<br>
1.sentence-transformers
<br>
2. scikit-learn
<br>
3. numpy
<br>
4. cv2 (OpenCV)
<br>
5. json
<br>
6. skimage (scikit-image)
<br>
<br>
I have primarily focused on the models and techniques for similarity checking of both text and images, integrating them with the backend. My main emphasis has been on AI integration, utilizing the backend to process requests. For the frontend, I used React, while Express was employed for the backend. Instead of using a cloud database, I opted for local databases, which are included in the repository.

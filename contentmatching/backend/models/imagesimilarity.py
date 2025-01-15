import sys
import os
import cv2
import numpy as np
import json
from skimage.metrics import structural_similarity as ssim

def calculate_similarity(image1_path, image2_path):
    image1 = cv2.imread(image1_path, cv2.IMREAD_GRAYSCALE)
    image2 = cv2.imread(image2_path, cv2.IMREAD_GRAYSCALE)
    
    if image1 is None or image2 is None:
        return 0
    
    image1 = cv2.resize(image1, (300, 300))
    image2 = cv2.resize(image2, (300, 300))
    
    score, _ = ssim(image1, image2, full=True)
    return score

def find_most_similar_image(user_image_path, database_directory):
    highest_similarity = 0
    most_similar_image = None
    
    for image_name in os.listdir(database_directory):
        image_path = os.path.join(database_directory, image_name)
        similarity = calculate_similarity(user_image_path, image_path)
        
        if similarity > highest_similarity:
            highest_similarity = similarity
            most_similar_image = image_name
    
    if most_similar_image:
        result = {
            "most_similar_image": most_similar_image,
            "similarity_score": highest_similarity
        }
    else:
        result = {
            "error": "No similar image found."
        }
    
    # Only print the final result in JSON format
    print(json.dumps(result))


if __name__ == "__main__":
    user_image = sys.argv[1]
    database_dir = sys.argv[2]
    
    find_most_similar_image(user_image, database_dir)

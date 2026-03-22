from flask import Flask, request, jsonify, send_from_directory
import pickle
import re
import os
import json
import csv
import logging

# Configure logging (less verbose for production)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allow all origins for now, can be restricted later

logger.info("🚀 Flask app starting up...")
logger.info(f"🚀 Current directory: {os.getcwd()}")
logger.info(f"🚀 Static folder: {app.static_folder}")
logger.info(f"🚀 Static URL path: {app.static_url_path}")

# Static stopwords
STOP_WORDS = {'i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','through','during','before','after','above','below','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','can','will','just','should','now'}

# Load models lazily to prevent import errors
model = None
vectorizer = None

def load_models():
    global model, vectorizer
    if model is not None and vectorizer is not None:
        return
    
    logger.info("🚀 Loading ML models...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    logger.info(f"🚀 Current directory: {current_dir}")
    
    model_path = os.path.join(current_dir, "sentiment_model.pkl")
    vectorizer_path = os.path.join(current_dir, "vectorizer.pkl")
    
    logger.info(f"🚀 Model path: {model_path}")
    logger.info(f"🚀 Vectorizer path: {vectorizer_path}")
    
    if os.path.exists(model_path):
        model = pickle.load(open(model_path, "rb"))
        logger.info("🚀 Model loaded successfully!")
    else:
        logger.error(f"🚨 Model file not found: {model_path}")
        
    if os.path.exists(vectorizer_path):
        vectorizer = pickle.load(open(vectorizer_path, "rb"))
        logger.info("🚀 Vectorizer loaded successfully!")
    else:
        logger.error(f"🚨 Vectorizer file not found: {vectorizer_path}")

# Large dataset reading removed from global initialization to prevent slow server wake-ups.
# Data is now streamed directly during hashtag analysis.


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)
    words = text.split()
    words = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return " ".join(words)

@app.route('/api')
def api_root():
    logger.info("🔍 API root endpoint called")
    return jsonify({"message": "Twitter Sentiment Analysis API", "status": "running"})

@app.route('/health')
def health():
    logger.info("🔍 Health check endpoint called")
    return jsonify({"status": "healthy", "models_loaded": bool(model and vectorizer)})

@app.route('/predict', methods=['POST'])
def predict_sentiment():
    logger.info("🔍 DEBUG: Predict endpoint called")
    logger.info(f"🔍 DEBUG: Request method: {request.method}")
    logger.info(f"🔍 DEBUG: Request headers: {dict(request.headers)}")
    logger.info(f"🔍 DEBUG: Request data: {request.data}")
    
    try:
        # Load models on first request
        load_models()
        
        if not model or not vectorizer:
            logger.error("🚨 DEBUG: Model or vectorizer not loaded")
            return jsonify({"error": "Model not loaded"}), 500
        
        data = json.loads(request.data)
        logger.info(f"🔍 DEBUG: Parsed data: {data}")
        
        tweet = data.get("tweet", "")
        logger.info(f"🔍 DEBUG: Tweet to analyze: {tweet}")
        
        cleaned = clean_text(tweet)
        logger.info(f"🔍 DEBUG: Cleaned text: {cleaned}")
        
        vector = vectorizer.transform([cleaned])
        logger.info(f"🔍 DEBUG: Vector shape: {vector.shape}")
        
        prediction = model.predict(vector)[0]
        probabilities = model.predict_proba(vector)[0]
        logger.info(f"🔍 DEBUG: Prediction: {prediction}")
        logger.info(f"🔍 DEBUG: Probabilities: {probabilities}")
        
        result = {
            "sentiment": "Positive" if prediction == 1 else "Negative",
            "confidence": round(float(max(probabilities)) * 100, 2),
            "probabilities": {
                "negative": round(float(probabilities[0]) * 100, 2),
                "positive": round(float(probabilities[1]) * 100, 2)
            }
        }
        logger.info(f"🔍 DEBUG: Result: {result}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"🚨 DEBUG: Error in predict: {str(e)}")
        logger.error(f"🚨 DEBUG: Error type: {type(e)}")
        import traceback
        logger.error(f"🚨 DEBUG: Traceback: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-hashtag', methods=['POST'])
def analyze_hashtag():
    logger.info("🔍 DEBUG: Analyze hashtag endpoint called")
    logger.info(f"🔍 DEBUG: Request method: {request.method}")
    logger.info(f"🔍 DEBUG: Request headers: {dict(request.headers)}")
    logger.info(f"🔍 DEBUG: Request data: {request.data}")
    
    try:
        # Load models on first request
        load_models()
        
        if not model or not vectorizer:
            logger.error("🚨 DEBUG: Model or vectorizer not loaded")
            return jsonify({"error": "Model not loaded"}), 500
        
        data = json.loads(request.data)
        logger.info(f"🔍 DEBUG: Parsed data: {data}")
        
        hashtag = data.get("hashtag", "")
        logger.info(f"🔍 DEBUG: Hashtag to analyze: {hashtag}")
        
        # Define current_dir for file paths
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        sample_tweets = []
        if hashtag:
            lower_hashtag = hashtag.lower().strip()
            # If they entered a hash symbol, skip it for the word search
            if lower_hashtag.startswith('#'):
                lower_hashtag = lower_hashtag[1:]
                
            search_str = f" {lower_hashtag} "
            
            # Read files dynamically here to avoid loading huge datasets into memory on backend startup
            for filename in ["train_data.csv", "test_data.csv"]:
                filepath = os.path.join(current_dir, filename)
                if not os.path.exists(filepath):
                    continue
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        reader = csv.reader(f)
                        try:
                            next(reader) # skip header
                        except StopIteration:
                            pass
                        for row in reader:
                            if row:
                                t = row[0]
                                padded_t = f" {t.lower()} "
                                if search_str in padded_t:
                                    sample_tweets.append(t)
                                    # Limit the number of tweets analyzed per search request
                                    # to prevent long TTFB and memory overflow bugs
                                    if len(sample_tweets) >= 1000:
                                        break
                except Exception as e:
                    print(f"Warning: Could not search {filename}: {e}")
                
                if len(sample_tweets) >= 1000:
                    break
                        
        if not sample_tweets:
            sample_tweets = [f"No real tweets found containing {hashtag}."]
        
        cleaned = [clean_text(t) for t in sample_tweets]
        vectors = vectorizer.transform(cleaned)
        preds = model.predict(vectors)
        probs = model.predict_proba(vectors)
        
        pos_count = int(sum(preds == 1))
        neg_count = int(sum(preds == 0))
        total = len(sample_tweets)
        
        tweets = []
        for i, (tweet, pred, prob) in enumerate(zip(sample_tweets, preds, probs)):
            tweets.append({
                "tweet": tweet,
                "sentiment": "Positive" if pred == 1 else "Negative",
                "confidence": round(float(max(prob)) * 100, 2),
                "keyword": hashtag
            })
        
        return jsonify({
            "hashtag": hashtag,
            "total_tweets": total,
            "positive_count": pos_count,
            "negative_count": neg_count,
            "positive_percentage": round((pos_count / total) * 100, 1),
            "negative_percentage": round((neg_count / total) * 100, 1),
            "tweets": tweets,
            "word_cloud": [{"text": hashtag, "value": 50}]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"🚀 Starting Flask app on port {port}")
    app.run(host="0.0.0.0", port=port)

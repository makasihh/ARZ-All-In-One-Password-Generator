import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from random import choice
import string
import nltk

app = Flask(__name__)
CORS(app)

nltk_data_path = os.path.join(os.path.dirname(__file__), "nltk_data")
nltk.data.path.append(nltk_data_path)


@app.route("/")
def home():
    return "ARZ ALL IN ONE PASSWORD GENERATOR BACKEND"


@app.route("/generate-password", methods=["POST"])
def generate_password():
    data = request.get_json()
    length = data.get("length", 12)
    include_numbers = data.get("includeNumbers", True)
    include_symbols = data.get("includeSymbols", True)
    include_uppercase = data.get("includeUppercase", True)
    include_lowercase = data.get("includeLowercase", True)
    include_numbers_percent = data.get("includeNumbersPercent", 25)
    include_symbols_percent = data.get("includeSymbolsPercent", 25)
    include_memorable = data.get("includeMemorable", False)
    memorable_separator = data.get("memorableSeparator", "-")

    characters = ""
    if include_uppercase:
        characters += string.ascii_uppercase
    if include_lowercase:
        characters += string.ascii_lowercase
    if include_numbers:
        characters += string.digits[: int(length * include_numbers_percent / 100)]
    if include_symbols:
        characters += string.punctuation[: int(length * include_symbols_percent / 100)]

    if include_memorable:
        # Gunakan pemisah kata yang dapat diingat
        words = nltk.corpus.words.words()
        memorable_words = [choice(words) for _ in range(length)]
        password = memorable_separator.join(memorable_words)
    else:
        while len(characters) < length:
            characters += string.ascii_letters
        password = "".join(choice(characters) for _ in range(length))

    return jsonify({"password": password})


if __name__ == "__main__":
    app.run(debug=True)

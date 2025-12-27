
import requests
import json
import sys

def test_chat():
    url = "http://127.0.0.1:8000/api/v1/chat"
    payload = {"message": "How many projects does sumit have?"}
    
    print(f"Testing {url}...")
    
    try:
        with requests.post(url, json=payload, stream=True) as r:
            if r.status_code != 200:
                print(f"Error: {r.status_code}")
                print(r.text)
                return

            print("Streaming response:")
            for chunk in r.iter_content(chunk_size=None):
                if chunk:
                    print(chunk.decode('utf-8'), end='', flush=True)
    except Exception as e:
        print(f"\nRequest failed: {e}")

if __name__ == "__main__":
    test_chat()

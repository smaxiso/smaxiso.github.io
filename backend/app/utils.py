import os
import cloudinary
import cloudinary.uploader
import re

# Configure Cloudinary (ensure these env vars are set)
# We do this at module level so it runs when imported
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def delete_cloudinary_image(image_url: str):
    """
    Deletes an image from Cloudinary given its URL.
    Extracts the public_id from the URL and calls the destroy API.
    """
    if not image_url:
        return

    try:
        # Expected format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
        # We need to extract <public_id>
        
        # Regex to find everything after the version number (v\d+/) and before the extension
        # This handles cases with folders if public_id includes slashes
        match = re.search(r'/upload/(?:v\d+/)?(.+?)\.[a-zA-Z]+$', image_url)
        
        if match:
            public_id = match.group(1)
            print(f"🗑️ Attempting to delete Cloudinary image: {public_id}")
            result = cloudinary.uploader.destroy(public_id)
            print(f"✅ Cloudinary delete result: {result}")
        else:
            print(f"⚠️ Could not extract public_id from URL: {image_url}")

    except Exception as e:
        print(f"❌ Error deleting Cloudinary image: {e}")

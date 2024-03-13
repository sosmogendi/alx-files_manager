import base64
import requests
import sys

# Get the file path from command-line arguments
file_path = sys.argv[1]
file_name = file_path.split('/')[-1]  # Extract file name from path

# Encode the file contents in base64
file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare JSON payload and headers for the POST request
r_json = {
    'name': file_name,
    'type': 'image',
    'isPublic': True,
    'data': file_encoded,
    'parentId': sys.argv[3]  # Assuming sys.argv[3] contains the parent ID
}
r_headers = {'X-Token': sys.argv[2]}  # Assuming sys.argv[2] contains the authentication token

# Send POST request to upload the image
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)

# Print the response JSON
print(r.json())

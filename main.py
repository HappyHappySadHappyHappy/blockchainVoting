import random

import requests

# candidates = ["Bjp", "Congress", "Aap", "Other"]
# votes = random.choices(candidates, weights=[3, 1, 1, 1], k=13)
# for vote in votes:
#     print("http://localhost:3000/?transaction=" + vote)
#     response = requests.post("http://localhost:3000/?transaction=" + vote)
#     print(response.text)

response = requests.get("http://localhost:3000/calculate")
print(response.text)


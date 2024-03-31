import requests
# response = requests.post("http://localhost:3000/?transaction=BJP")
# print(response.text)


resp = requests.get("http://localhost:3000/calculate")
print(resp.text)


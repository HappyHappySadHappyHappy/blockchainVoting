import requests
response = requests.post("http://payrollmanagement.great-site.net/z/new.php?data=657687678")
print(response.text)


# resp = requests.get("http://localhost:3000/calculate")
# print(resp.text)





# vote through console 
# fetch('http://localhost:3000/?transaction=Bjp', {
#   method: 'POST',
# })
# .then(response => response.text())
# .then(data => console.log(data))
# .catch(error => console.error('Error:', error));
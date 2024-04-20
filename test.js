fetch("http://payrollmanagement.great-site.net/z/new.php?data=20",{method:"POST"}).then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));



const url = 'http://localhost:3000/';
const data = { input: 2000 };
const headers = {
  'Content-Type': 'application/json',
  // Add any other headers you need here
};

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});

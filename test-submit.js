import fetch from 'node-fetch';

async function testSubmit() {
  const response = await fetch('http://localhost:3001/api/submit-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test User',
      email: 'testuser@example.com',
      phone: '9876543210',
      course: 'MBA',
      state: 'Delhi'
    })
  });

  const result = await response.json();
  console.log(result);
}

testSubmit(); 


const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // 1. Check unauthenticated access
    console.log('Testing unauthenticated access...');
    let res = await fetch(`${API_URL}/notes`);
    if (res.status !== 401) throw new Error('Unauthenticated access should be blocked');
    console.log('Unauthenticated access blocked successfully.');

    // 2. Register user 1
    console.log('\nRegistering User 1...');
    res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User 1', email: 'user1@example.com', password: 'password123' })
    });
    let data = await res.json();
    if (res.status !== 201 && res.status !== 400) {
        console.log(data);
        throw new Error('Failed to register user 1');
    }
    // If it already exists, login instead
    if (res.status === 400) {
        res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'user1@example.com', password: 'password123' })
        });
        data = await res.json();
    }
    const token1 = data.token;
    console.log('User 1 authenticated.');

    // 3. Register user 2
    console.log('\nRegistering User 2...');
    res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User 2', email: 'user2@example.com', password: 'password123' })
    });
    data = await res.json();
    if (res.status !== 201 && res.status !== 400) throw new Error('Failed to register user 2');
    if (res.status === 400) {
        res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'user2@example.com', password: 'password123' })
        });
        data = await res.json();
    }
    const token2 = data.token;
    console.log('User 2 authenticated.');

    // 4. Create Note with User 1
    console.log('\nCreating note for User 1...');
    res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token1}` },
        body: JSON.stringify({ title: 'Test Note', content: 'This is a test note' })
    });
    data = await res.json();
    if (res.status !== 201) throw new Error('Failed to create note');
    const noteId = data._id;
    console.log('Note created successfully:', noteId);

    // 5. Test validation (missing content)
    console.log('\nTesting validation (missing content)...');
    res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token1}` },
        body: JSON.stringify({ title: 'Test Note 2' })
    });
    if (res.status !== 400) throw new Error('Validation failed to catch missing content');
    console.log('Validation works.');

    // 6. Get notes for User 1
    console.log('\nFetching notes for User 1...');
    res = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token1}` }
    });
    data = await res.json();
    if (res.status !== 200 || !Array.isArray(data) || data.length === 0) throw new Error('Failed to fetch notes');
    console.log('Notes fetched successfully, count:', data.length);

    // 7. Test User Ownership (User 2 trying to access User 1's note)
    console.log('\nTesting ownership (User 2 accessing User 1 note)...');
    res = await fetch(`${API_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token2}` }
    });
    if (res.status !== 401) throw new Error('User 2 was able to access User 1 note!');
    console.log('Ownership enforced successfully.');

    // 8. Update note with User 1
    console.log('\nUpdating note for User 1...');
    res = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token1}` },
        body: JSON.stringify({ title: 'Updated Note', content: 'Updated content' })
    });
    data = await res.json();
    if (res.status !== 200 || data.title !== 'Updated Note') throw new Error('Failed to update note');
    console.log('Note updated successfully.');

    // 9. Delete note with User 1
    console.log('\nDeleting note for User 1...');
    res = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token1}` }
    });
    if (res.status !== 200) throw new Error('Failed to delete note');
    console.log('Note deleted successfully.');

    // 10. Check health endpoint
    console.log('\nChecking health endpoint...');
    res = await fetch(`${API_URL}/health`);
    if (res.status !== 200) throw new Error('Health endpoint failed');
    console.log('Health endpoint works.');

    console.log('\nALL TESTS PASSED!');
  } catch (error) {
    console.error('\nTEST FAILED:', error.message);
    process.exit(1);
  }
}

testAPI();

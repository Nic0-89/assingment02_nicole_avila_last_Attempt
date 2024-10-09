import { test, expect } from '@playwright/test';
//import { faker } from '@faker-js/faker';
//import { title } from 'process';

//comment

test.describe('Test suite backend', () => {
  let token = '';

  test('Test case 01 - Log into app POST', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        username: 'tester01',
        password: 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c',
      },
      headers: {
        'Content-Type': 'application/json',
      },

    });
    token = (await loginResponse.json()).token;
    expect(loginResponse.status()).toBe(200);
    const responseInfo = await loginResponse.json();

    expect(responseInfo).toHaveProperty('token');
    expect(responseInfo.token).toBeTruthy()
    token = responseInfo.token; // Set the token for use in the next test
    console.log(await loginResponse.text());
  });



  test('Test case 02 - Get ALL room', async ({ request }) => {
    const roomResponse = await request.get('http://localhost:3000/api/rooms', {
      headers: {
        "X-user-auth": JSON.stringify({
          username: 'tester01',
          token: token,
        }),
      },
    });

    expect(roomResponse.status()).toBe(200);

  });



  test('Test case 03 - Get all clients', async ({ request }) => {
    // has the token been saved?
    expect(token).toBeTruthy(); // to check if token is set

    const clientResponse = await request.get('http://localhost:3000/api/clients', {

      headers: {
        "X-user-auth": JSON.stringify({
          username: 'tester01', // You may want to use the username from the login response
          token: token,
        }),
      },
    });
    expect(clientResponse.ok()).toBeTruthy();
    expect(clientResponse.status()).toBe(200);
    const responseBody = JSON.parse(await clientResponse.text());
    expect(responseBody).toHaveProperty('name');

  });

  test('Test case 02 - Get all posts', async ({ request }) => {

    var getPostsResponse = await request.get('http://localhost:3000/posts');
    expect(getPostsResponse.ok()).toBeTruthy();

  });


  //       3. Create a New Room (POST)
  // Description: Test the functionality of creating a new room with valid data.
  // Send a POST request to create a room with valid data 
  // Verify the status code is 201 Created.
  test('Test case 03 - Create room with POST', async ({ request }) => {

    var getPostsResponse = await request.post('http://localhost:3000/api/room/new', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: token
        }),
        'Content-Type': 'application/json'
      },
      data: {
        features: ['balcony'],
        category: 'single',
        number: '4',
        floor: '5',
        available: true,
        price: 2000
      }
    });
    expect(getPostsResponse.status()).toBe(201);
    const room = await getPostsResponse.json();
    expect(room).toHaveProperty('floor');
  });

  test('Test case 04 - Get all rooms', async ({ request }) => {

    var getRoomsResponse = await request.get('http://localhost:3000/api/rooms', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: token
        }),
        'Content-Type': 'application/json'
      },
    });
    expect(getRoomsResponse.status()).toBe(200);
    const rooms = await getRoomsResponse.json();
    expect(rooms).toBeTruthy;
  });

  // 2. Create a New Client (POST)
  // Send a POST request to add a new client with valid data (e.g., name, email, phone number).
  // Verify that the status code is 201 Created.

  test('Test case 05 - Create Client with POST', async ({ request }) => {
    const newClient = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Elm Street",
    };

    var getclientResponse = await request.post('http://localhost:3000/api/client/new', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: token
        }),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(newClient),
    });
    expect(getclientResponse.status).toBe(201);
    let getclient = await getclientResponse.json()
    expect(getclient).toHaveProperty('name');

  });
});


// 3. Create a New Reservation (POST)
// Description: Test making a new reservation for a client in a specific room.
// Send a POST request to create a reservation with valid room and client IDs and booking details (e.g., check-in/check-out dates).
// Verify the status code is 201 Created.

// 4. Edit Room Details (PUT)
// Description: Test updating an existing room's details (e.g., changing room price).
// Verify the status code is 200 OK.


// 5. Edit Client Information (PUT)
// Description: Test editing a client's information (e.g., updating their phone number).

// Send a PUT request to update the client's information.
// Verify the status code is 200 OK.

// 6. Delete a Reservation (DELETE)
// Description: Test deleting a reservation.

// Send a DELETE request to remove a reservation.
// Verify the status code is 204 No Content.
// Attempt to fetch the deleted reservation and confirm it no longer exists (status 404).


// 7. Create a New Bill (POST)
// Description: Test creating a new bill for a client and their reservation.
// Verify the status code is 201 Created.

// 8. Fetch All Clients (GET)
// Description: Test fetching a list of all clients.
// Verify the status code is 200 OK.

// 9. Invalid Data for Creating a Room (POST)
// Description: Test creating a new room with invalid or missing data (e.g., missing price).
// Verify the status code is 400 Bad Request.


// 10. Delete a Client (DELETE)
// Description: Test deleting a client.
// Verify the status code is 204 No Content.
// Confirm that the client has been deleted by trying to fetch it again (status 404).

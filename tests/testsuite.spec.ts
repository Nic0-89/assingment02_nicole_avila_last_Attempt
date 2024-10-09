import { test, expect } from '@playwright/test'
import { Console } from 'console';
//import { createToken } from '../server/helper';
const BASE_URL = 'http://localhost:3000/';


test.describe('Test suite backend V1', () => {
  let tokenValue: ""
  test.beforeEach('Test case 01 - Login ', async ({ request }) => {

    const responseLoging = await request.post("http://localhost:3000/api/login", {
      data: {
        username: "tester01",
        password: "GteteqbQQgSr88SwNExUQv2ydb7xuf8c"
      }
    });
    const responseBody = await responseLoging.json();
    tokenValue = responseBody.token;
    console.log(tokenValue)
  });

  test('Test case 02 - Get all rooms', async ({ request }) => {
    expect(tokenValue).toBeTruthy();
    const getPostsResponse = await request.get('http://localhost:3000/api/rooms', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: tokenValue
        }),
        'Content-Type': 'application/json'
      },

    });

    expect(getPostsResponse.status()).toBe(200);
    expect(getPostsResponse.ok()).toBeTruthy();

    const rooms = (await getPostsResponse.json())
    console.log(rooms)
  });


  // 1. Create a New Room (POST)
  // Description: Test the functionality of creating a new room with valid data.
  // Send a POST request to create a room with valid data 
  // Verify the status code is 201 Created.

  test('Test case 03 - Create room with POST', async ({ request }) => {

    var getPostsResponse = await request.post('http://localhost:3000/api/room/new', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: tokenValue
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
    expect(getPostsResponse.status()).toBe(200); //it shouldn be 201??
    const room = await getPostsResponse.json();
    expect(room).toHaveProperty('floor');
  });

  test('Test case 04 - Get all rooms', async ({ request }) => {

    var getRoomsResponse = await request.get('http://localhost:3000/api/rooms', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: tokenValue
        }),
        'Content-Type': 'application/json'
      },
    });
    expect(getRoomsResponse.status()).toBe(200);
    const rooms = await getRoomsResponse.json();
    expect(rooms).toBeTruthy();
  });

  // 2. Create a New Client (POST)
  // Send a POST request to add a new client with valid data (e.g., name, email, phone number).
  // Verify that the status code is 201 Created.

  test('Test case 05 - Create Client with POST', async ({ request }) => {
    const newClient = {
      name: "John Doe",           // Replace with actual client data
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Elm Street",
    };
    var getclientResponse = await request.post('http://localhost:3000/api/client/new', {
      headers: {
        'X-user-auth': JSON.stringify({
          username: 'tester01',
          token: tokenValue
        }),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(newClient),
    });
    expect(getclientResponse.status()).toBe(200); // WHY IT EXPECT IT TO BE 200 AND NOT 201??? 
    let getclient = await getclientResponse.json()
    expect(getclient).toHaveProperty('name');
  });


// 3. Create a New Reservation (POST)
// Steps:
// Send a POST request to create a reservation with valid room and client IDs and booking details (e.g., check-in/check-out dates).
// Verify the status code is 201 Created.

test('Test case 06 - Create Reservation with POST', async ({ request }) => {
  expect(tokenValue).toBeTruthy();

  const data = {
    client: 2,
    room: 1,
    bill: 1,
    start: "2024-11-11",
    end: "2024-11-20"
  };

  const postReservationResponse = await request.post('http://localhost:3000/api/reservation/new', {
    headers: {
      'X-user-auth': JSON.stringify({
        username: 'tester01',
        token: tokenValue
      }),
      'Content-Type': 'application/json'
    },
    data: data
  });

  expect(postReservationResponse.status()).toBe(200);
  const reserv = await postReservationResponse.json();
  expect(reserv.client).toBe(data.client);
  expect(reserv.room).toBe(data.room);
  expect(reserv.start).toBe(data.start);
  expect(reserv.end).toBe(data.end);

});



// 4. Edit Room Details (PUT)
// Send a PUT request to update the room's details (e.g., modify price).
// Verify the status code is 200 OK.
test('Test case 07 - Edit Room with PUT', async ({ request }) => {
  expect(tokenValue).toBeTruthy();

  // Data to update the room - adjust as needed for your API
  const data = {
    number: 222,
    price: 2500
    ,
  };

  const putRoomResponse = await request.put('http://localhost:3000/api/room/1', {
    headers: {
      'X-user-auth': JSON.stringify({
        username: 'tester01',
        token: tokenValue
      }),
      'Content-Type': 'application/json'
    },
    data: data
  });

  // Check for a successful response status
  const room = await putRoomResponse.json();
  expect(putRoomResponse.status()).toBe(200); // 
  expect(room).toHaveProperty('Category'); // 
});


// 8. Delete a Reservation (DELETE)
// Send a DELETE request to remove a reservation.
// Verify the status code is 204 No Content.



test('Test case 08 - Delete Room with delete', async ({ request }) => {
  expect(tokenValue).toBeTruthy();

  const deleteRoom = await request.delete('http://localhost:3000/api/room/1', {
    headers: {
      'X-user-auth': JSON.stringify({
        username: 'tester01',
        token: tokenValue
      }),
      'Content-Type': 'application/json'
    },
  });

  expect(deleteRoom.status()).toBe("ok");
  const retrieveRoom = await request.get('http://localhost:3000/api/room/1')
  expect(retrieveRoom.status()).toBe(404)
});

//DELETE request to remove a client.
// Verify the status code is 204 No Content.
// Confirm that the client has been deleted by trying to fetch it again (status 404).

test('DELETE request to remove a client', async ({ request }) => {
  const clientId = 1; 
  const deleteResponse = await request.delete(`http://localhost:3000/api/client/${clientId}`);

  //status code is 204 No Content?
  expect(deleteResponse.status()).toBe(204);

  const fetchResponse = await request.get(`http://localhost:3000/api/client/${clientId}`);
  //status code is 404 Not Found?
  expect(fetchResponse.status()).toBe(404);

});


// 10 Edit Client Information (PUT)
// Send a PUT request to update the client's information.
// Verify the status code is 200 OK.
// Fetch the client info and verify the update.
test('Edit client information (PUT)', async ({ request }) => {
  const clientId = 1;

  const updatedClientData = {
    name: "Anya lala",
    email: "anyanew@123.com",
    telephone: '070 000 1111'
  };

  const putResponse = await request.put(`http://localhost:3000/api/client/${clientId}`, {
    data: updatedClientData,
  });

  //status code is 200 OK
  expect(putResponse.status()).toBe(200);

  const fetchResponse = await request.get(`http://localhost:3000/api/client/${clientId}`);
  const fetchedClientData = await fetchResponse.json();

  // new data matches?
  expect(fetchedClientData.name).toBe(updatedClientData.name);
  expect(fetchedClientData.email).toBe(updatedClientData.email);
  // Add assertions for other fields as needed

});
});

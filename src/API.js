export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiMGIwODVjNi0xMTM3LTQ5ZTgtYjlmZS0zMjQxZjk1NWIwZTciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc1NzQyMTAwOCwiZXhwIjoxOTE1MjA5MDA4fQ.EN7KBGxzmNXmg0sX52F5eYNLntCX8J0ovzdc6Br1vUo";

export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};
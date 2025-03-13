import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTBlZDVjN2RjNGEyNjkwMmVjOWIyZjZjYjM4YWUxYWMyODg1ODg5NmE4NzIwZjhjMjkzNDYxZjQ5OTRiNTU0M2EzZTA4ZTc3MWVjYWVhMjciLCJpYXQiOjE3NDE4MjUwNTQuODI5OTc4LCJuYmYiOjE3NDE4MjUwNTQuODI5OTgsImV4cCI6MTc3MzM2MTA1NC44MTUzNjgsInN1YiI6IjllNmIwMDBjLWRkYTUtNGE1OS04NTQwLWIwNmQ1ODE4ZjJjYiIsInNjb3BlcyI6WyJzaGlwcGluZy1jYWxjdWxhdGUiXX0.eXGPXAECMu17yO9uEfr78OjIZVeZH6mU7uRLGboLYodVrGIbbkewXUsm04nLwmD2QMmYMqnt2iDMRHV2aEYbPmhqivxLtn5TH1DaSkl1EdfeBUkWvm2-MEftB-YX7KttdaHtDeW55xv-g7UcvEqoVO3NoWu0IDfEKvB3Vah6Mq1gvnN4HGu2I4gBAO9TgQYGBnVrLPyWxpSxYQvCtuvJVxYGKjJhVmqm1A9oziQFPsHoKPCbfV1SGLCxWTqth2t3u10RQvBbdWVniniIdqphP8u1vAEfPSy6Hoh1adnr5wCjDUt__kcP5mazoXMp8SoJkT_E9wSBWEQ8e8-ECvPkBRhVUbMQ72Z_h9mtvdgPn3OB1VYbQs4kDSTKtCX-wB5qpK-UI_hzoYwPIzicwPDpHrkjVtQcoHGDJ2cVM1RlnuyydZKYL0MgqAH_8bWyXiZbo3heXz2dy04A9YUrmlW6_LqAByfLWkcgDE8C8oyCgQ4Iryctz_6yCBRIp2nusbgWd49EYjiyV1IbbWVKfz9_hsv7p3bT_7yrlqXCZ1FFFQ1kofqfQNVIXBdJWTz9Gp3YDXpi1yFDS-HL5muqxRzxST0CVjpGsJf8GyHZVxKzlzI4pFjfcUena77qMJeonemH9l9JwIAGX7Jj4LPpFWDBSICROnjCiu8pLmw0QsCz60s`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Aplicação carlos8189.mk@gmail.com',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch from Melhor Envio:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

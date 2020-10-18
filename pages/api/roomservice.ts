import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const user = nanoid();

  const r = await fetch('https://super.roomservice.dev/provision', {
    method: 'post',
    headers: {
      Authorization: `Bearer: ${process.env.ROOMSERVICE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: user,
      resources: body.resources,
    }),
  });

  const json = await r.json();
  res.json(json);
};

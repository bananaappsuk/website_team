// pages/api/signup.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                toast.error("User is not authenticated");
                return;
            }

            const token = await user.getIdToken();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, req.body,
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      }
      );
      res.status(201).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(400).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

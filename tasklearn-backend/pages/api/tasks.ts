// pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Task from '../../models/Task';

// Ensure that Mongoose uses the correct database connection string from the environment variables
const connectDB = async () => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DB as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Connect to the database

  if (req.method === 'POST') {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(200).json({ message: 'Task saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving task' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Handle unsupported methods
  }
}

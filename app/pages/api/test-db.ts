import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/mongodb'; // Adjust this import path if your file is not in 'lib'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // This is the line that will trigger the connection
    await getDatabase();

    // If it gets here, the connection was successful
    res
      .status(200)
      .json({ success: true, message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res
      .status(500)
      .json({ success: false, message: 'Database connection failed!' });
  }
}
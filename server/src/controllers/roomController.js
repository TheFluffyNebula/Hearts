import { generateId } from '../utils/roomUtils.js';

const createRoom = (req, res) => {
  res.json({ roomId: generateId(), userId: generateId() });
}

export { createRoom };

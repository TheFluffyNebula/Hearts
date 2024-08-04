import { v4 as uuidv4 } from 'uuid';

let rooms = new Map();

const generateId = () => {
  return uuidv4();
}

export { generateId };

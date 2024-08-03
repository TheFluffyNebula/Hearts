import express from 'express';
import roomRoutes from './routes/roomRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

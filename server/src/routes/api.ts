import { Router } from 'express';
import { searchAddresses } from '../controllers/searchController';

const router = Router();

// Define GET route as requested [cite: 12]
router.get('/search/:query', searchAddresses);

export default router;
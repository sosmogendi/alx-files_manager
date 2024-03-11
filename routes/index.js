import express from 'express';
import AppController from '../controllers/AppController';

function setupRoutes(app) {
  const router = express.Router();
  app.use('/', router);

  // Routes handled by the App Controller
  router.get('/status', (req, res) => AppController.getStatus(req, res));
  router.get('/stats', (req, res) => AppController.getStats(req, res));
}

export default setupRoutes;

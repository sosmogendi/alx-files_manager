import express from 'express';
import UsersController from '../controllers/UsersController';
import AppController from '../controllers/AppController';

function setupRoutes(app) {
  const router = express.Router();
  app.use('/', router);

  // Routes handled by the App Controller
  router.get('/status', (req, res) => AppController.getStatus(req, res));
  router.get('/stats', (req, res) => AppController.getStats(req, res));

	// Routes handled by the User Controller
	router.post('/users', (req, res) => UsersController.postNew(req, res));
}

export default setupRoutes;

import express from 'express';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import AppController from '../controllers/AppController';

function setupRoutes(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => AppController.getStatus(req, res));
  router.get('/stats', (req, res) => AppController.getStats(req, res));
  router.post('/users', (req, res) => UsersController.postNew(req, res));
  router.get('/connect', (req, res) => AuthController.getConnect(req, res));
  router.get('/disconnect', (req, res) => AuthController.getDisconnect(req, res));
  router.get('/users/me', (req, res) => UsersController.getMe(req, res));
}

export default setupRoutes;

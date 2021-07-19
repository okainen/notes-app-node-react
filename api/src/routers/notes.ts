import express from 'express';
import {noteController} from '../di';

const router = express.Router();
router.post('/', noteController.create);
router.get('/:id', noteController.get);
router.get('/', noteController.getAll);
router.patch('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;

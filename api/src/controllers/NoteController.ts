import {Request, Response} from 'express';
import {CreateNoteReqModel, UpdateNoteReqModel} from '@/requestModels';
import {toJson} from './helpers';
import {INoteService} from '@/interfaces/services';

export default class NoteController {
  constructor(private noteService: INoteService) {}

  get = async (req: Request, res: Response) => {
    const resModel = await this.noteService.get(
      req.currentUser!,
      req.params.id,
      req.query
    );
    res.status(200).json(toJson(resModel));
  };

  getAll = async (req: Request, res: Response) => {
    const resModels = await this.noteService.getAll(
      req.currentUser!,
      req.query
    );
    res.status(200).json(toJson(resModels));
  };

  create = async (req: Request, res: Response) => {
    const resModel = await this.noteService.create(
      req.currentUser!,
      new CreateNoteReqModel(req.body)
    );
    res.status(201).json(toJson(resModel));
  };

  update = async (req: Request, res: Response) => {
    const resModel = await this.noteService.update(
      req.currentUser!,
      req.params.id,
      new UpdateNoteReqModel(req.body)
    );
    res.status(200).json(toJson(resModel));
  };

  delete = async (req: Request, res: Response) => {
    const resModel = await this.noteService.delete(
      req.currentUser!,
      req.params.id
    );
    res.status(204).json(toJson(resModel));
  };
}

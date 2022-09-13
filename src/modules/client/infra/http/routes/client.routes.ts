import { Router } from 'express';
const clientRouter = Router();

// Criação de Client
clientRouter.post('/');

//Atualização de Password
clientRouter.post('');

//Remoção de Client pelo Client Customer Admin
clientRouter.delete('/client/:user_id');

//Deve ser testável por isso não pode depender de services externos;
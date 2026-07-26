import { authHandlers } from './auth';
import { trainingHandlers } from './training';

export const handlers = [...authHandlers, ...trainingHandlers];

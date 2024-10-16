import { Router } from 'express'
import { OpenAIController } from '../controllers/openAI.ts'

export const openAIRouter = Router()

openAIRouter.post('/', OpenAIController.generateStepsWithOpenAI)
openAIRouter.post('/message', OpenAIController.responseMessage)

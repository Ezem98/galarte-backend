import { Router } from 'express'
import { ConversationController } from '../controllers/conversations.ts'

export const conversationRouter = Router()

conversationRouter.post('/', ConversationController.create)

conversationRouter.get('/:id', ConversationController.get)
conversationRouter.get('/user/:userId', ConversationController.getAllByUserId)

conversationRouter.delete('/:id', ConversationController.delete)

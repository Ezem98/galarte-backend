import { Router } from 'express'
import { ConversationMessageController } from '../controllers/conversationMessages.ts'

export const conversationMessageRouter = Router()

conversationMessageRouter.post('/', ConversationMessageController.create)

conversationMessageRouter.get('/:id', ConversationMessageController.get)
conversationMessageRouter.get(
    '/:conversationId',
    ConversationMessageController.getAllByConversationId
)

conversationMessageRouter.delete('/:id', ConversationMessageController.delete)

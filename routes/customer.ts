import { Router } from 'express'
import { CustomerController } from '../controllers/customer.ts'

export const customersRouter = Router()

customersRouter.get('/', CustomerController.getAll)

customersRouter.get('/:id', CustomerController.getById)

customersRouter.post('/', CustomerController.create)

customersRouter.patch('/:id', CustomerController.update)

customersRouter.delete('/:id', CustomerController.delete)

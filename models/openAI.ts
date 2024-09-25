import OpenAI from 'openai'
import { IDBResponse } from '../types/dbResponse.ts'
import { IOpenAI } from '../types/openAI.ts'
import { EXPERIENCE_LEVEL } from '../utils/consts.ts'

export class OpenAIModel {
    static openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY,
        organization: process.env.OPEN_AI_ORGANIZATION_ID,
        project: process.env.OPEN_AI_PROJECT_ID,
    })

    static async generateStepsWithOpenAI(
        openAIProps: IOpenAI
    ): Promise<IDBResponse> {
        const { modelName, modelSize, experienceLevel } = openAIProps

        const thread = await this.openai.beta.threads.create()

        await this.openai.beta.threads.messages.create(thread.id, {
            role: 'assistant',
            content: `Como especialista en construcción, necesito que escribas una lista paso a paso en formato json con un título y una breve explicación sobre como construir ${modelName} de ${
                modelSize.width / 100
            } metro/s de largo y ${
                modelSize.height / 100
            } metro/s de alto para una persona con ${
                EXPERIENCE_LEVEL[experienceLevel]
            }, toda terminología necesaria para explicar cada paso, no solo la menciones también explica el concepto. En cuanto al lenguaje, necesito que utilices palabras que sean de uso común en argentina y solo quiero el json, con las claves: "titulo", "explicacion", "pasos" y dentro de pasos la lista de pasos con este formato: "paso", "titulo", "descripcion". Ademas no quiero me envies ningún texto de más.`,
        })

        const run = await this.openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: process.env.OPEN_AI_ASSITANT_ID ?? '',
            }
        )

        if (run.status === 'completed') {
            const messages = await this.openai.beta.threads.messages.list(
                run.thread_id
            )

            const message = messages.data[0]

            return {
                successfully: true,
                message: 'Steps generated',
                data: JSON.parse((message.content[0] as any).text.value),
            }
        } else {
            return {
                successfully: false,
                message: 'Failed to generate steps',
            }
        }
    }
}

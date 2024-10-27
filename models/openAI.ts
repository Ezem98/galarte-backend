import OpenAI from 'openai'
import { Categories } from '../enums/categories.ts'
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
        const { modelCategory, modelName, modelSize, experienceLevel } =
            openAIProps

        const thread = await this.openai.beta.threads.create()

        await this.openai.beta.threads.messages.create(thread.id, {
            role: 'assistant',
            content: `Como especialista en construcción, necesito que escribas una lista paso a paso en formato json con un título y una breve explicación sobre como ${
                modelCategory == Categories.Opening ||
                modelCategory == Categories.Floor ||
                modelCategory == Categories.Roof
                    ? 'colocar'
                    : 'construir'
            } ${modelName} de ${modelSize.width / 100} metro/s de largo y ${
                modelSize.height / 100
            } metro/s de alto para una persona con ${
                EXPERIENCE_LEVEL[experienceLevel]
            }, toda terminología necesaria para explicar cada paso, no solo la menciones también explica el concepto. En cuanto al lenguaje, necesito que utilices palabras que sean de uso común en argentina y solo quiero el json, con las claves: "titulo", "explicacion", "pasos" y dentro de pasos la lista de pasos con este formato: "paso", "titulo", "descripcion". Además agrega la clave "materiales" y dentro de ella iría la lista de materiales con este formato: "material", "cantidad" que es un string del numero y su unidad intrínseca de medida, "finalidad". También una clave "tiempo_insumido" expresada en minutos que va a ser un entero que representa el tiempo aproximado que le llevará a la persona realizar la obra en base a su experiencia. Por último una clave "costo" que sería el costo aproximado promedio de realizar la obra expresado en dolares. Asimismo no quiero me envies ningún texto de más. Revisa bien la estructura del JSON.`,
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

    static async responseMessage(message: string): Promise<IDBResponse> {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful profesional building assistant.',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        })

        if (completion.created) {
            const choice = completion.choices[0]

            return {
                successfully: true,
                message: 'Message generated',
                data: choice.message.content,
            }
        } else
            return {
                successfully: false,
                message: 'Failed to generate message',
            }
    }
}

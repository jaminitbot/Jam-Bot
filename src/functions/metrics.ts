import { collectDefaultMetrics, Counter, register } from 'prom-client'
import Fastify, { FastifyInstance } from 'fastify'
const server: FastifyInstance = Fastify({})

export const defaultLabels = {
    NODE_ENV: process.env.NODE_ENV
}
const interactionCounter = new Counter({
    name: 'interaction_counter_total',
    help: 'Total number of interaction events received',
    labelNames: ['interaction_type', 'command_name'] as const
})
const eventsCounter = new Counter({
    name: 'events_counter_total',
    help: 'Total number of gateway events received',
    labelNames: ['event_name'] as const
})
export async function initProm() {
    collectDefaultMetrics({
        labels: defaultLabels
    })
    server.get('/metrics', async (request, reply) => {
        try {
            reply.header('Content-Type', register.contentType)
            return await register.metrics()
        } catch (err) {
            reply.code(503)
            return 'An error occurred'
        }
    })
    server.listen(process.env.PROM_PORT ?? 3000)
}

type InteractionType = 'command' | 'context_menu' | 'autocomplete' | 'button' | 'select_menu'
export function incrementInteractionCounter(interactionType: InteractionType, commandName: string) {
    interactionCounter.inc({
        interaction_type: interactionType,
        command_name: commandName
    })
}
type EventName = 'guild_create' | 'guild_delete' | 'guild_member_add' | 'guild_member_remove' | 'interaction_create' | 'message_create' | 'message_delete' | 'message_update'
export function incrementEventsCounter(eventName: EventName) {
    eventsCounter.inc({
        event_name: eventName
    })
}
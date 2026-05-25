import { type SchemaTypeDefinition } from 'sanity'
import { artistType } from './artist'
import { timelineEventType } from './timelineEvent'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artistType, timelineEventType],
}

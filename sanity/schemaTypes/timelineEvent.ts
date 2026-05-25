import { defineField, defineType } from 'sanity'

export const timelineEventType = defineType({
    name: 'timelineEvent',
    title: 'Timeline Event',
    type: 'document',
    groups: [
        { name: 'main', title: 'Basic Info' },
        { name: 'details', title: 'Content & Media' },
        { name: 'relations', title: 'Relations' },
    ],
    fieldsets: [
        { name: 'timing', title: 'Timing & Duration' }
    ],
    fields: [
        defineField({
            name: 'artist',
            title: 'Artist',
            type: 'reference',
            to: [{ type: 'artist' }],
            validation: (Rule) => Rule.required(),
            group: 'main',
        }),
        defineField({
            name: 'title',
            title: 'Event Title',
            type: 'string',
            description: 'e.g., "After Hours", "The Eras Tour", or "Starboy Music Video"',
            validation: (Rule) => Rule.required(),
            group: 'main',
        }),
        defineField({
            name: 'date',
            title: 'Date / Start Date',
            type: 'date',
            description: 'Release date or the opening night of a tour.',
            fieldset: 'timing',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'toDate',
            title: 'End Date',
            type: 'date',
            description: 'Only for Tours: When did the tour end?',
            hidden: ({ document }) => document?.type !== 'tour',
            fieldset: 'timing',
            group: 'main',
        }),
        defineField({
            name: 'type',
            title: 'Event Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Album Release', value: 'album' },
                    { title: 'Single Release', value: 'single' },
                    { title: 'Music Video', value: 'video' },
                    { title: 'Tour (Main Event)', value: 'tour' },
                    { title: 'Individual Concert', value: 'concert' },
                    { title: 'Festival Appearance', value: 'festival' },
                ],
            },
            validation: (Rule) => Rule.required(),
            group: 'main',
        }),
        defineField({
            name: 'parentAlbum',
            title: 'Belongs to Album (Optional)',
            description: 'If this is a single, link it to the main album it belongs to.',
            type: 'reference',
            to: [{ type: 'timelineEvent' }],
            options: {
                filter: 'type == "album"'
            },
            hidden: ({ document }) => document?.type !== 'single',
            group: 'relations',
        }),
        defineField({
            name: 'parentTour',
            title: 'Belongs to Tour (Optional)',
            description: 'If this is a concert, link it to the main Tour it belongs to.',
            type: 'reference',
            to: [{ type: 'timelineEvent' }],
            options: {
                filter: 'type == "tour"'
            },
            hidden: ({ document }) => document?.type !== 'concert',
            group: 'relations',
        }),
        defineField({
            name: 'tracklist',
            title: 'Tracklist',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }) => document?.type !== 'album' && document?.type !== 'single',
            group: 'details',
        }),
        defineField({
            name: 'videoUrl',
            title: 'YouTube / Video Link',
            type: 'url',
            hidden: ({ document }) =>
                document?.type !== 'video' &&
                document?.type !== 'concert' &&
                document?.type !== 'single',
            group: 'details',
        }),
        defineField({
            name: 'description',
            title: 'Description/Notes',
            type: 'text',
            rows: 3,
            group: 'details',
        }),
        defineField({
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            group: 'details',
        }),
    ],
    orderings: [{
        name: 'date',
        title: 'Date',
        by: [
            { field: 'date', direction: 'desc' },
        ],
    }],
    preview: {
        select: {
            title: 'title',
            subtitle: 'type',
            media: 'image',
        },
    },
})
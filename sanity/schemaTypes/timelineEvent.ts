import { defineField, defineType } from 'sanity'

export const timelineEventType = defineType({
    name: 'timelineEvent',
    title: 'Timeline Event',
    type: 'document',
    fields: [
        defineField({
            name: 'artist',
            type: 'reference',
            to: [{ type: 'artist' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            type: 'string',
            title: 'Event Title (e.g. Album Name or Tour Name)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'tracklist',
            type: 'array',
            title: 'Tracklist',
            of: [{ type: 'string' }],
            hidden: ({ document }) => document?.type !== 'album' && document?.type !== 'single',
        }),
        defineField({
            name: 'parentAlbum',
            title: 'Part of Album (Optional)',
            description: 'If this is a single, you can link it to the main Album event later',
            type: 'reference',
            to: [{ type: 'timelineEvent' }],
            options: {
                filter: 'type == "album"'
            },
            hidden: ({ document }) => document?.type !== 'single',
        }),
        defineField({
            name: 'type',
            type: 'string',
            options: {
                list: [
                    { title: 'Music Video', value: 'video' },
                    { title: 'Album Release', value: 'album' },
                    { title: 'Single Release', value: 'single' },
                    { title: 'Concert/Gig', value: 'concert' },
                    { title: 'Festival', value: 'festival' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'videoUrl',
            type: 'url',
            title: 'YouTube URL',
            hidden: ({ document }) => document?.type !== 'video' && document?.type !== 'concert',
        }),
        defineField({
            name: 'description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            type: 'image',
            options: { hotspot: true },
        }),
    ],
})
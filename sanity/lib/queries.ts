import { defineQuery } from "next-sanity";

export const ARTIST_TIMELINE_QUERY = defineQuery(`
  *[_type == "artist" && slug.current == $slug][0]{
    name,
    bio,
    image,
    "events": *[_type == "timelineEvent" && references(^._id)] | order(date desc) {
      title,
      date,
      type,
      videoUrl,
      description,
      image,
      tracklist,
      "parentAlbumTitle": parentAlbum->title
    }
  }
`)
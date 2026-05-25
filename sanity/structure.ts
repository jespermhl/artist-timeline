import type { StructureResolver } from 'sanity/structure'
import {
  UsersIcon,
  PlayIcon,
  EarthAmericasIcon,
  ComponentIcon,
  DashboardIcon,
  CalendarIcon,
} from '@sanity/icons'

const API_VERSION = '2026-05-25'

const commonSortOptions = (S: any) => [
  S.orderingMenuItem({
    title: 'Date (Newest)',
    by: [{ field: 'date', direction: 'desc' }],
  }),
  S.orderingMenuItem({
    title: 'Date (Oldest)',
    by: [{ field: 'date', direction: 'asc' }],
  }),
  S.orderingMenuItem({
    title: 'Title (A-Z)',
    by: [{ field: 'title', direction: 'asc' }],
  }),
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Events by Artist')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('artist')
            .title('Select Artist')
            .child((artistId) =>
              S.list()
                .title('Artist Content')
                .items([
                  S.listItem()
                    .title('All Artist Events')
                    .icon(CalendarIcon)
                    .child(
                      S.documentList()
                        .title('All Events')
                        .apiVersion(API_VERSION)
                        .filter('_type == "timelineEvent" && artist._ref == $artistId')
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                        .defaultOrdering([{ field: 'date', direction: 'desc' }])
                    ),
                  S.divider(),
                  S.listItem()
                    .title('Albums')
                    .icon(ComponentIcon)
                    .child(
                      S.documentList()
                        .title('Albums')
                        .apiVersion(API_VERSION)
                        .filter(
                          '_type == "timelineEvent" && type == "album" && artist._ref == $artistId'
                        )
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                    ),
                  S.listItem()
                    .title('Tours')
                    .icon(EarthAmericasIcon)
                    .child(
                      S.documentList()
                        .title('Tours')
                        .apiVersion(API_VERSION)
                        .filter(
                          '_type == "timelineEvent" && type == "tour" && artist._ref == $artistId'
                        )
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                    ),
                  S.listItem()
                    .title('Music Videos')
                    .icon(PlayIcon)
                    .child(
                      S.documentList()
                        .title('Music Videos')
                        .apiVersion(API_VERSION)
                        .filter(
                          '_type == "timelineEvent" && type == "video" && artist._ref == $artistId'
                        )
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                    ),
                  S.listItem()
                    .title('Singles')
                    .icon(PlayIcon)
                    .child(
                      S.documentList()
                        .title('Singles')
                        .apiVersion(API_VERSION)
                        .filter(
                          '_type == "timelineEvent" && type == "single" && artist._ref == $artistId'
                        )
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                    ),
                  S.listItem()
                    .title('Concerts')
                    .icon(CalendarIcon)
                    .child(
                      S.documentList()
                        .title('Concerts')
                        .apiVersion(API_VERSION)
                        .filter(
                          '_type == "timelineEvent" && type == "concert" && artist._ref == $artistId'
                        )
                        .params({ artistId })
                        .menuItems(commonSortOptions(S))
                    ),
                ])
            )
        ),

      S.divider(),

      S.listItem()
        .title('Events by Category (Global)')
        .icon(DashboardIcon)
        .child(
          S.list()
            .title('Categories')
            .items([
              S.listItem()
                .title('All Albums')
                .icon(ComponentIcon)
                .child(
                  S.documentList()
                    .title('All Albums')
                    .apiVersion(API_VERSION)
                    .filter('_type == "timelineEvent" && type == "album"')
                    .menuItems(commonSortOptions(S))
                ),
              S.listItem()
                .title('All Tours')
                .icon(EarthAmericasIcon)
                .child(
                  S.documentList()
                    .title('All Tours')
                    .apiVersion(API_VERSION)
                    .filter('_type == "timelineEvent" && type == "tour"')
                    .menuItems(commonSortOptions(S))
                ),
              S.listItem()
                .title('All Music Videos & Singles')
                .icon(PlayIcon)
                .child(
                  S.documentList()
                    .title('Media')
                    .apiVersion(API_VERSION)
                    .filter(
                      '_type == "timelineEvent" && (type == "video" || type == "single")'
                    )
                    .menuItems(commonSortOptions(S))
                ),
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !['timelineEvent'].includes(listItem.getId() as string)
      ),
    ])
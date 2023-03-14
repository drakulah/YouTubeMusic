import parseMenu, { Menu } from '../component/parseMenu.ts'
import { ErrOnNull, Let, LoopThrough } from '../../../tools/inline.ts'
import parseItemType, { ItemType } from '../component/parseItemType.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import { isChannelSubscribers, isItemType, isSeperatorText } from '../../../tools/patterns.ts'

export interface ArtistCard {
  title: string,
  type: ItemType,
  browseId: string,
  subscribers?: string,
  thumbnails: Thumbnail[],
  menu: Menu
}

export default (raw: any): ArtistCard | undefined => {
  try {
    // Variables
    let _title: string
    let _browseId: string
    let _subscribers: string
    let _type: ItemType = 'ARTIST'

    Let(raw, (sharedRaw) => {
      _type = parseItemType(sharedRaw?.navigationEndpoint)
      _browseId = sharedRaw?.navigationEndpoint?.browseEndpoint?.browseId
      _title = sharedRaw?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text
        ?? sharedRaw?.title?.runs?.[0]?.text
      _subscribers = isChannelSubscribers(sharedRaw?.subtitle?.runs?.[0]?.text) ? sharedRaw?.subtitle?.runs?.[0]?.text : undefined

      LoopThrough(sharedRaw?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs, (_, sharedDetail: any) => {

        const _txt = sharedDetail?.text?.trim()

        if (isSeperatorText(_txt) || isItemType(_txt)) return
        else if (isChannelSubscribers(_txt)) _subscribers = _txt
        
      })
    })

    return {
      type: _type,
      browseId: ErrOnNull(_browseId!),
      subscribers: _subscribers!,
      title: ErrOnNull(_title!),
      menu: parseMenu(raw?.menu),
      thumbnails: parseThumbnail(raw?.thumbnailRenderer ?? raw?.thumbnail)
    }
  } catch (_) {
    return undefined
  }
}
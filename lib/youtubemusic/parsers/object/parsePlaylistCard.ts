import { ShortUploader } from './parseSong.ts'
import parseBadges from '../component/parseBadges.ts'
import parseMenu, { Menu } from '../component/parseMenu.ts'
import parseItemType, { ItemType } from '../component/parseItemType.ts'
import { ErrOnNull, Let, LoopThrough, When } from '../../../tools/inline.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import { isItemType, isSeperatorText, isSongCountText } from '../../../tools/patterns.ts'

export interface PlaylistCard {
  title: string,
  type: ItemType,
  count?: string,
  subtitle: string,
  playlistId: string,
  isExplicit: boolean,
  thumbnails: Thumbnail[],
  uploaders: ShortUploader[],
  menu: Menu
}

export default (raw: any): PlaylistCard | undefined => {
  try {
    // Constants
    const _subtitle: string[] = []
    const _artists: ShortUploader[] = []
    const _badges = parseBadges(raw?.subtitleBadges)

    // Variables
    let _count: string
    let _title: string
    let _playlistId: string
    let _type: ItemType = 'PLAYLIST'

    Let(raw, (sharedRaw) => {
      _title = sharedRaw?.title?.runs?.[0]?.text
      ?? sharedRaw?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text
      _type = parseItemType(sharedRaw?.navigationEndpoint)
      _playlistId = sharedRaw?.navigationEndpoint?.browseEndpoint?.browseId

      LoopThrough(sharedRaw?.subtitle?.runs
        ?? sharedRaw?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs, (_, sharedDetail: any) => {

        const __type = parseItemType(sharedDetail?.navigationEndpoint)
        const _txt = ErrOnNull(sharedDetail?.text)?.trim()

        When(__type,
          'ARTIST', 'USER_CHANNEL' , () => {
            _artists.push({
              name: _txt,
              isArtist: __type === 'ARTIST',
              browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
            })
          },
          'else', () => {
            if (isSeperatorText(_txt) || isItemType(_txt)) return
            else if (isSongCountText(_txt)) _count = _txt
            else _subtitle.push(_txt)
          }
        )

      })

    })

    return {
      type: _type,
      count: _count!,
      playlistId: ErrOnNull(_playlistId!),
      title: ErrOnNull(_title!),
      subtitle: _subtitle.join(', '),
      isExplicit: _badges.isExplicit,
      menu: parseMenu(raw?.menu),
      uploaders: _artists,
      thumbnails: parseThumbnail(raw?.thumbnailRenderer ?? raw?.thumbnail)
    }
  } catch (_) {
    return undefined
  }
}
import { ShortUploader } from './parseSong.ts'
import parseBadges from '../component/parseBadges.ts'
import parseMenu, { Menu } from '../component/parseMenu.ts'
import parseItemType, { ItemType } from '../component/parseItemType.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import { ErrOnNull, Let, LoopThrough, MixArrays, When } from '../../../tools/inline.ts'
import { isDurationText, isItemType, isSeperatorText, isVideoViews } from '../../../tools/patterns.ts'

export interface Video {
  id: string,
  title: string,
  views: string,
  type: ItemType,
  isExplicit: boolean,
  durationText?: string,
  uploaders: ShortUploader[],
  thumbnails: Thumbnail[]
  menu: Menu
}

export default (raw: any): Video | undefined => {
  try {
    // Constants
    const _artists: ShortUploader[] = []
    const _badges = parseBadges(raw?.badges)

    // Variables
    let _id: string
    let _title: string
    let _views = '0 view'
    let _durationText: string
    let _type: ItemType = 'VIDEO'

    // Parse card video [16:9]
    Let(raw, (sharedRaw) => {
      _title = sharedRaw?.title?.runs?.[0]?.text
      _type = parseItemType(sharedRaw?.navigationEndpoint)
      _id = sharedRaw?.navigationEndpoint?.watchEndpoint?.videoId

      LoopThrough(sharedRaw?.subtitle?.runs
        ?? raw?.shortBylineText.runs
        ?? raw?.longBylineText.runs, (_, sharedDetail: any) => {

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
            else if (isDurationText(_txt)) _durationText = _txt
            else if (isVideoViews(_txt)) _views = _txt
            else _artists.push({ name: _txt, isArtist: false })
          }
        )

      })
      
    })

    // Parse linear card Video
    LoopThrough(MixArrays(raw?.flexColumns, raw?.fixedColumns), (_, eachDetail: any) => {

      LoopThrough(eachDetail?.musicResponsiveListItemFlexColumnRenderer?.text?.runs
        ?? eachDetail?.musicResponsiveListItemFixedColumnRenderer?.text?.runs, (_, sharedDetail: any) => {

        const __type = parseItemType(sharedDetail?.navigationEndpoint)
        const _txt = ErrOnNull(sharedDetail?.text)?.trim()

        When(__type,
          'SONG', 'VIDEO', () => {
            _title = _txt
            _type = __type
            _id = ErrOnNull(sharedDetail?.navigationEndpoint?.watchEndpoint?.videoId)
          },
          'ARTIST', 'USER_CHANNEL' , () => {
            _artists.push({
              name: _txt,
              isArtist: __type === 'ARTIST',
              browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
            })
          },
          'else', () => {
            if (isSeperatorText(_txt) || isItemType(_txt)) return
            else if (isDurationText(_txt)) _durationText = _txt
            else if (isVideoViews(_txt)) _views = _txt
            else _artists.push({ name: _txt, isArtist: false })
          }
        )

      })

    })

    return {
      type: _type,
      views: _views,
      id: ErrOnNull(_id!),
      title: ErrOnNull(_title!),
      durationText: _durationText!,
      isExplicit: _badges.isExplicit,
      menu: parseMenu(raw?.menu ?? raw?.musicTwoRowItemRenderer?.menu),
      uploaders: _artists,
      thumbnails: parseThumbnail(raw?.thumbnail ?? raw?.thumbnailRenderer)
    }
  } catch (_) {
    return undefined
  }
}
import parseBadges from '../component/parseBadges.ts'
import parseMenu, { Menu } from '../component/parseMenu.ts'
import { ErrOnNull, LoopThrough, MixArrays, When } from '../../../tools/inline.ts'
import parseItemType, { ItemType } from '../component/parseItemType.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import { isDurationText, isItemType, isSeperatorText } from '../../../tools/patterns.ts'

export interface ShortAlbum {
  name: string,
  browseId?: string,
}

export interface ShortUploader {
  name: string,
  browseId?: string
  isArtist: boolean
}

export interface Song {
  id: string,
  title: string,
  type: ItemType,
  isExplicit: boolean,
  durationText?: string,
  album?: ShortAlbum,
  uploaders: ShortUploader[],
  thumbnails: Thumbnail[]
  menu: Menu
}

export default (raw: any): Song | undefined => {
  try {
    // Constants
    const _artists: ShortUploader[] = []
    const _badges = parseBadges(raw?.badges)

    // Variables
    let _id: string = raw?.navigationEndpoint?.watchEndpoint?.videoId
    let _title: string = raw?.title?.runs?.[0]?.text
    let _album: ShortAlbum
    let _durationText: string = raw?.lengthText?.runs?.[0]?.text
    let _type: ItemType = 'SONG'

    LoopThrough(raw?.shortBylineText?.runs ?? raw?.longBylineText?.runs, (_, sharedDetail: any) => {

      const __type = parseItemType(sharedDetail?.navigationEndpoint)
      const _txt = ErrOnNull(sharedDetail?.text)?.trim()

      When(__type,
        'SONG', 'VIDEO', () => {
          _type = __type
          _title = _txt
          _id = ErrOnNull(sharedDetail?.navigationEndpoint?.watchEndpoint?.videoId)
        },
        'ALBUM', () => {
          _album = {
            name: _txt,
            browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
          }
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
          else _artists.push({ name: _txt, isArtist: false })
        }
      )

    })

    LoopThrough(MixArrays(raw?.flexColumns, raw?.fixedColumns), (_, eachDetail: any) => {

      LoopThrough(eachDetail?.musicResponsiveListItemFlexColumnRenderer?.text?.runs
        ?? eachDetail?.musicResponsiveListItemFixedColumnRenderer?.text?.runs, (_, sharedDetail: any) => {

        const __type = parseItemType(sharedDetail?.navigationEndpoint)
        const _txt = ErrOnNull(sharedDetail?.text)?.trim()

        When(__type,
          'SONG', 'VIDEO', () => {
            _type = __type
            _title = _txt
            _id = ErrOnNull(sharedDetail?.navigationEndpoint?.watchEndpoint?.videoId)
          },
          'ALBUM', () => {
            _album = {
              name: _txt,
              browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
            }
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
            else _artists.push({ name: _txt, isArtist: false })
          }
        )

      })

    })

    return {
      type: _type,
      id: ErrOnNull(_id!),
      title: ErrOnNull(_title!),
      durationText: _durationText!,
      isExplicit: _badges.isExplicit,
      album: _album!,
      menu: parseMenu(raw?.menu),
      uploaders: _artists,
      thumbnails: parseThumbnail(raw?.thumbnail)
    }
  } catch (_) {
    return undefined
  }
}
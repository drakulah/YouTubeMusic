import { ShortUploader } from './parseSong.ts'
import parseBadges from '../component/parseBadges.ts'
import parseMenu, { Menu } from '../component/parseMenu.ts'
import parseItemType, { ItemType } from '../component/parseItemType.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import { ErrOnNull, Let, LoopThrough, MixArrays, When } from '../../../tools/inline.ts'
import { isAlbumYear, isItemType, isAlbumType, isSeperatorText } from '../../../tools/patterns.ts'

export interface AlbumCard {
  year?: string,
  title: string,
  type: ItemType,
  browseId: string,
  albumType: string,
  isExplicit: boolean,
  uploaders: ShortUploader[],
  thumbnails: Thumbnail[],
  menu: Menu
}

export default (raw: any): AlbumCard | undefined => {

  // Constants
  const _artists: ShortUploader[] = []
  const _badges = parseBadges(raw?.subtitleBadges)

  // Variables
  let _year: string
  let _title: string
  let _browseId: string
  let _albumType = 'Album'
  let _type: ItemType = 'ALBUM'

  Let(raw, (sharedRaw) => {
    const _navEndpoint = sharedRaw?.title?.runs?.[0]?.navigationEndpoint ?? sharedRaw?.navigationEndpoint

    _title = sharedRaw?.title?.runs?.[0]?.text ?? sharedRaw?.title?.runs?.[0]?.text ?? sharedRaw?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text
    _type = parseItemType(_navEndpoint)
    _browseId = _navEndpoint?.browseEndpoint?.browseId

    LoopThrough(
      MixArrays(sharedRaw?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs,
      sharedRaw?.secondTitle?.runs, sharedRaw?.subtitle?.runs), (_, sharedDetail: any) => {

        const __type = parseItemType(sharedDetail?.navigationEndpoint)
        const _txt = sharedDetail?.text?.trim()

        When(__type,
          'ARTIST', 'USER_CHANNEL', () => {
            _artists.push({
              name: _txt,
              isArtist: __type === 'ARTIST',
              browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
            })
          },
          'else', () => {
            if (isSeperatorText(_txt)) return
            else if (isAlbumType(_txt)) _albumType = _txt
            else if (isAlbumYear(_txt)) _year = _txt
          }
        )

      })

  })

  return {
    year: _year!,
    type: _type,
    browseId: ErrOnNull(_browseId!),
    title: ErrOnNull(_title!),
    isExplicit: _badges.isExplicit,
    albumType: _albumType,
    menu: parseMenu(raw?.menu),
    uploaders: _artists,
    thumbnails: parseThumbnail(raw?.thumbnailRenderer ?? raw?.thumbnail)
  }

}
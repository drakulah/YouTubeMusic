import { Let, LoopThrough, When } from '../../../tools/inline.ts'

export interface Menu {
  radioId: string
  albumId?: string
  artistId?: string
}

/**
 * Provide `Object.menu`
 */
export default (raw: any): Menu => {

  let radioId: string
  let albumId: string | undefined
  let artistId: string | undefined

  LoopThrough(raw?.menuRenderer?.items, (_, item: any) => {

    Let(item?.menuNavigationItemRenderer, (sharedMenu) => {

      When(sharedMenu?.text?.runs?.[0]?.text?.toUpperCase(),
        'START RADIO', () => {
          Let(sharedMenu?.navigationEndpoint, (sharedEndpoint) => {
            radioId = sharedEndpoint?.watchEndpoint?.playlistId ?? sharedEndpoint?.watchPlaylistEndpoint?.playlistId
          })
        },
        'GO TO ALBUM', () => {
          albumId = sharedMenu?.navigationEndpoint?.browseEndpoint?.browseId
        },
        'GO TO ARTIST', () => {
          artistId = sharedMenu?.navigationEndpoint?.browseEndpoint?.browseId
        }
      )
    })

  })

  return {
    radioId : radioId!,
    albumId,
    artistId
  }
}
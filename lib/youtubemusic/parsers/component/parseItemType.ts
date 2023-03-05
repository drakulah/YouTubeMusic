import { When } from '../../../tools/inline.ts'

export type ItemType = 'MIX'
| 'SONG'
| 'VIDEO'
| 'ALBUM'
| 'ARTIST'
| 'PLAYLIST'
| 'USER_CHANNEL'


/**
 * Provide `Object.navigationEndpoint`
 */
export default (raw: any): ItemType => {
  let t: ItemType = 'MIX'

  When(raw?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType
    ?? raw?.watchEndpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType,
  'MUSIC_VIDEO_TYPE_ATV', () => t = 'SONG',
  'MUSIC_PAGE_TYPE_ALBUM', () => t = 'ALBUM',
  'MUSIC_PAGE_TYPE_ARTIST', () => t = 'ARTIST',
  'MUSIC_PAGE_TYPE_USER_CHANNEL', () => t = 'USER_CHANNEL',
  'MUSIC_PAGE_TYPE_PLAYLIST', () => t = 'PLAYLIST',
  'MUSIC_VIDEO_TYPE_OMV', 'MUSIC_VIDEO_TYPE_UGC', () => t = 'VIDEO'
  )

  return t
}
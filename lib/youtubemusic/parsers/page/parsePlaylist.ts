import parseItemType from '../component/parseItemType.ts'
import parseVideo, { Video } from '../object/parseVideo.ts'
import parseAlbumCard, { AlbumCard } from '../object/parseAlbumCard.ts'
import parseSong, { ShortUploader, Song } from '../object/parseSong.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import parseArtistCard, { ArtistCard } from '../object/parseArtistCard.ts'
import { isNullOrEmpty, Let, LoopThrough, MixArrays, When } from '../../../tools/inline.ts'
import parsePlaylistCard, { PlaylistCard } from '../object/parsePlaylistCard.ts'
import parseBadges from '../component/parseBadges.ts'
import parseMenu, { Menu } from "../component/parseMenu.ts";
import parseContinuation from '../component/parseContinuation.ts'
import { isAlbumDuration, isAlbumYear, isItemType, isSeperatorText, isSongCountText } from '../../../tools/patterns.ts'

interface Header {
  title: string,
  subtitle?: string,
  browseId?: string,
  thumbnail: Thumbnail[]
}

type Content = Song | Video | AlbumCard | ArtistCard | PlaylistCard

type Track = Song | Video

interface Container {
  header: Header,
  contents: Content[]
}

interface Playlist {
  title: string,
  desc?: string,
  year?: string,
  count?: string,
  menu: Menu,
  isExplicit: boolean,
  playlistType: string,
  playlistDuration?: string,
  uploaders: ShortUploader[],
  playlistThumbnail: Thumbnail[],
  tracks: Track[],
  tracksContinuation?: string,
  other: Container[],
  otherContinuation?: string,
}

interface PlaylistContinuation {
  trackContinuation?: string,
  tracks: Track[],
  other: Container[]
}

export default (rawRes: any): Playlist | PlaylistContinuation => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _tracks: Track[] = []
  const _container: Container[] = []
  const _uploaders: ShortUploader[] = []
  const _otherContinuation: string | undefined = parseContinuation(rawRes?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.continuations?.[0])

  // Declare variables
  let _menu: Menu | undefined
  let _desc: string | undefined
  let _count: string | undefined
  let _playlistDuration: string | undefined
  let _title: string | undefined
  let _year: string | undefined
  let _isExplicit = false
  let _playlistType = 'Playlist'
  let _playlistThumbnail: Thumbnail[] = []
  let _tracksContinuation: string | undefined

  // Parse album info
  Let(rawRes?.header?.musicDetailHeaderRenderer, (sharedHeader) => {
    const _badges = parseBadges(sharedHeader?.subtitleBadges)

    _menu = parseMenu(sharedHeader?.menu)
    _isExplicit = _badges?.isExplicit
    _title = sharedHeader?.title?.runs?.[0]?.text
    _desc = sharedHeader?.description?.runs?.[0]?.text
    _playlistThumbnail = parseThumbnail(sharedHeader?.thumbnail)

    LoopThrough(MixArrays(sharedHeader?.secondSubtitle?.runs, sharedHeader?.subtitle?.runs), (_, sharedDetail: any) => {

      const _txt = sharedDetail?.text?.trim()
      const __type = parseItemType(sharedDetail?.navigationEndpoint)

      When(__type,
        'ARTIST', 'USER_CHANNEL', () => {
          _uploaders.push({
            name: _txt,
            isArtist: __type === 'ARTIST',
            browseId: sharedDetail?.navigationEndpoint?.browseEndpoint?.browseId
          })
        },
        'else', () => {
          if (isSeperatorText(_txt) || isItemType(_txt)) return
          else if (isAlbumDuration(_txt)) _playlistDuration = _txt
          else if (isSongCountText(_txt)) _count = _txt
          else if (isAlbumYear(_txt)) _year = _txt
        }
      )

    })

  })

  // Start parsing
  LoopThrough(rawRes?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents
    ?? rawRes?.continuationContents?.sectionListContinuation?.contents
    ?? [rawRes?.continuationContents], (_, eachComponent: any) => {

      // Parse mainly interacted items
      Let(eachComponent?.musicPlaylistShelfRenderer
        ?? eachComponent?.musicCarouselShelfRenderer
        ?? eachComponent?.musicPlaylistShelfContinuation
        ?? eachComponent?.musicShelfRenderer, (sharedContainer) => {

          const _contents: Content[] = []
          let _header: Header | undefined

          // Parse header
          Let(sharedContainer?.header?.musicCarouselShelfBasicHeaderRenderer, (sharedHeader) => {
            _header = {
              title: sharedHeader?.title?.runs?.[0]?.text ?? '',
              subtitle: sharedHeader?.strapline?.runs?.[0]?.text,
              browseId: sharedHeader?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId,
              thumbnail: parseThumbnail(sharedHeader?.thumbnail)
            }
          })

          // Parse track continuation
          _tracksContinuation = parseContinuation(sharedContainer?.continuations?.[0])

          // Loop through every items
          LoopThrough(sharedContainer?.contents, (_, eachItem: any) => {
            
            const _itemRenderer = eachItem?.musicTwoRowItemRenderer ?? eachItem?.musicResponsiveListItemRenderer
            const _contentType = parseItemType(eachItem?.musicTwoRowItemRenderer?.navigationEndpoint
              ?? eachItem?.musicResponsiveListItemRenderer?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.navigationEndpoint)

            // Apply pattern for each item type
            When(_contentType,
              'SONG', () => {
                const _song = parseSong(_itemRenderer)
                if (!_song) return
                _tracks.push(_song)
              },
              'VIDEO', () => {
                const _video = parseVideo(_itemRenderer)
                if (!_video) return
                _tracks.push(_video)
              },
              'ALBUM', () => {
                const _album = parseAlbumCard(_itemRenderer)
                if (!_album) return
                _contents.push(_album)
              },
              'ARTIST', () => {
                const _artist = parseArtistCard(_itemRenderer)
                if (!_artist) return
                _contents.push(_artist)
              },
              'PLAYLIST', () => {
                const _playlist = parsePlaylistCard(_itemRenderer)
                if (!_playlist) return
                _contents.push(_playlist)
              }
            )

          })

          if (_contents.length !== 0) _container.push({
            header: _header!,
            contents: _contents
          })

        })

    })

  return isNullOrEmpty(_title)
    ? {
      tracksContinuation: _tracksContinuation,
      tracks: _tracks,
      other: _container
    } : {
      title: _title!,
      desc: isNullOrEmpty(_desc) ? undefined : _desc,
      year: _year,
      count: _count,
      playlistDuration: _playlistDuration,
      isExplicit: _isExplicit,
      menu: _menu!,
      playlistType: _playlistType,
      playlistThumbnail: _playlistThumbnail,
      uploaders: _uploaders,
      tracks: _tracks,
      other: _container,
      tracksContinuation: _tracksContinuation,
      otherContinuation: _otherContinuation
    }
}
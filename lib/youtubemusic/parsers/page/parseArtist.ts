import { Menu } from '../component/parseMenu.ts'
import parseSong, { Song } from '../object/parseSong.ts'
import parseItemType from '../component/parseItemType.ts'
import parseVideo, { Video } from '../object/parseVideo.ts'
import { Let, LoopThrough, When } from '../../../tools/inline.ts'
import parseAlbumCard, { AlbumCard } from '../object/parseAlbumCard.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import parseArtistCard, { ArtistCard } from '../object/parseArtistCard.ts'
import parsePlaylistCard, { PlaylistCard } from '../object/parsePlaylistCard.ts'

interface Header {
  title: string,
  subtitle?: string,
  browseId?: string,
  thumbnail: Thumbnail[]
}

type Content = Song | Video | AlbumCard | ArtistCard | PlaylistCard

interface Container {
  header: Header,
  contents: Content[]
}

interface Artist {
  thumbnails: Thumbnail[]
  title: string,
  desc?: string,
  subscribers: string,
  menu: Menu,
  contents: Container[]
}

export default (rawRes: any): Artist => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _container: Container[] = []
  const _background = parseThumbnail(rawRes?.header?.musicImmersiveHeaderRenderer?.thumbnail)

  // Declare variables
  let _desc: string | undefined
  let _title: string | undefined
  let _radioId: string | undefined
  let _subscribers: string | undefined

  Let(rawRes?.header?.musicImmersiveHeaderRenderer, header => {
    _title = header?.title?.runs?.[0]?.text
    _desc = header?.description?.runs?.[0]?.text
    _radioId = header?.startRadioButton?.buttonRenderer?.navigationEndpoint?.watchEndpoint?.playlistId
    _subscribers = header?.subscriptionButton?.subscribeButtonRenderer?.subscriberCountText?.runs?.[0]?.text
  })

  // Start parsing
  Let(rawRes?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer, (sharedSection) => {

    // Loop through all components
    LoopThrough(sharedSection?.contents, (_, eachComponent: any) => {
        
      // Parse mainly interacted items
      Let(eachComponent?.musicCarouselShelfRenderer ?? eachComponent?.musicShelfRenderer, (sharedContainer) => {

        const _contents: Content[] = []
        let _header: Header | undefined

        // Parse header
        Let(sharedContainer?.header?.musicCarouselShelfBasicHeaderRenderer ?? (sharedContainer?.title ? sharedContainer : undefined), (sharedHeader) => {
          _header = {
            title: sharedHeader?.title?.runs?.[0]?.text ?? '',
            subtitle: sharedHeader?.strapline?.runs?.[0]?.text,
            browseId: sharedHeader?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId,
            thumbnail: parseThumbnail(sharedHeader?.thumbnail)
          }
        })

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
              _contents.push(_song)
            },
            'VIDEO', () => {
              const _video = parseVideo(_itemRenderer)
              if (!_video) return
              _contents.push(_video)
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

        _container.push({
          header: _header!,
          contents: _contents
        })

      })

    })

  })

  return {
    title: _title!,
    desc: _desc,
    subscribers: _subscribers!,
    menu: {
      radioId: _radioId!
    },
    thumbnails: _background,
    contents: _container
  }
}
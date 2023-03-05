import parseSong, { Song } from '../object/parseSong.ts'
import parseItemType from '../component/parseItemType.ts'
import parseVideo, { Video } from '../object/parseVideo.ts'
import { Let, LoopThrough, When } from '../../../tools/inline.ts'
import parseContinuationComp from '../component/parseContinuation.ts'
import parseAlbumCard, { AlbumCard } from '../object/parseAlbumCard.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'
import parseArtistCard, { ArtistCard } from '../object/parseArtistCard.ts'
import parsePlaylistCard, { PlaylistCard } from '../object/parsePlaylistCard.ts'

interface Chip {
  title: string,
  continuation: string
}

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

interface Home {
  background?: {
    thumbnail: Thumbnail[]
  },
  versions?: Chip[],
  contents: Container[],
  continuation?: string
}

export default (rawRes: any): Home => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _chips: Chip[] = [
    {
      'title': 'Energize',
      'continuation': '4qmFsgJAEgxGRW11c2ljX2hvbWUaMGdnTWVTZ1FJQ1JBRFNnUUlCQkFCU2dRSUJ4QUJTZ1FJQXhBQlNnUUlCaEFCb0FZQg%3D%3D'
    },
    {
      'title': 'Workout',
      'continuation': '4qmFsgJAEgxGRW11c2ljX2hvbWUaMGdnTWVTZ1FJQ1JBQlNnUUlCQkFEU2dRSUJ4QUJTZ1FJQXhBQlNnUUlCaEFCb0FZQg%3D%3D'
    },
    {
      'title': 'Relax',
      'continuation': '4qmFsgJAEgxGRW11c2ljX2hvbWUaMGdnTWVTZ1FJQ1JBQlNnUUlCQkFCU2dRSUJ4QURTZ1FJQXhBQlNnUUlCaEFCb0FZQg%3D%3D'
    },
    {
      'title': 'Commute',
      'continuation': '4qmFsgJAEgxGRW11c2ljX2hvbWUaMGdnTWVTZ1FJQ1JBQlNnUUlCQkFCU2dRSUJ4QUJTZ1FJQXhBRFNnUUlCaEFCb0FZQg%3D%3D'
    },
    {
      'title': 'Focus',
      'continuation': '4qmFsgJAEgxGRW11c2ljX2hvbWUaMGdnTWVTZ1FJQ1JBQlNnUUlCQkFCU2dRSUJ4QUJTZ1FJQXhBQlNnUUlCaEFEb0FZQg%3D%3D'
    }
  ]
  const _container: Container[] = []
  const _background = { thumbnail: parseThumbnail(rawRes?.background) }
  
  // Declare variables
  let _continuation: string | undefined

  // Start parsing
  Let(rawRes?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
    ?? rawRes?.continuationContents?.sectionListContinuation, (sharedSection) => {

    // Parse continuation
    _continuation = parseContinuationComp(sharedSection?.continuations?.[0])

    // Loop through all components
    LoopThrough(sharedSection?.contents, (_, eachComponent: any) => {
        
      // Parse mainly interacted items
      Let(eachComponent?.musicCarouselShelfRenderer, (sharedContainer) => {

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
    background: rawRes?.continuationContents ? undefined : _background,
    versions: rawRes?.continuationContents ? undefined : _chips,
    contents: _container,
    continuation: _continuation
  }
}
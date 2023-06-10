import parseSong, { Song } from '../object/parseSong.ts'
import parseItemType from '../component/parseItemType.ts'
import parseVideo, { Video } from '../object/parseVideo.ts'
import { Let, LoopThrough, When } from '../../../tools/inline.ts'
import parseContinuationComp from '../component/parseContinuation.ts'
import parseAlbumCard, { AlbumCard } from '../object/parseAlbumCard.ts'
import parseArtistCard, { ArtistCard } from '../object/parseArtistCard.ts'
import parsePlaylistCard, { PlaylistCard } from '../object/parsePlaylistCard.ts'

interface Chip {
  title: string,
  params: string
}

type Content = Song | Video | AlbumCard | ArtistCard | PlaylistCard

interface Container {
  header: string,
  contents: Content[]
}

interface Search {
  chips: Chip[],
  contents: Container[],
  continuation?: string
}

export default (rawRes: any): Search => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _chips: Chip[] = []
  const _container: Container[] = []
  
  // Declare variables
  let _continuation: string | undefined


  // Start parsing
  Let(rawRes?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer, (sharedSection) => {

    // Parse headers
    LoopThrough(sharedSection?.header?.chipCloudRenderer?.chips, (_, eachChip: any) => {

      Let(eachChip?.chipCloudChipRenderer, (sharedChip) => {
        const _text = sharedChip?.text?.runs?.[0]?.text
        const _params = sharedChip?.navigationEndpoint?.searchEndpoint?.params

        if (_text && _params) _chips.push({ title: _text, params: _params })
      })
      
    })

    // Loop through all components
    LoopThrough(sharedSection?.contents, (_, eachComponent: any) => {
        
      // Parse mainly interacted items
      Let(eachComponent?.musicShelfRenderer, (sharedContainer) => {

        // Parse continuation
        _continuation = parseContinuationComp(sharedContainer?.continuations?.[0])

        const _contents: Content[] = []

        // Loop through every items
        LoopThrough(sharedContainer?.contents, (_, eachItem: any) => {

          const _itemRenderer = eachItem?.musicTwoRowItemRenderer ?? eachItem?.musicResponsiveListItemRenderer
          const _contentType = parseItemType(eachItem?.musicTwoRowItemRenderer?.navigationEndpoint
            ?? eachItem?.musicResponsiveListItemRenderer?.navigationEndpoint
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
          header: sharedContainer?.title?.runs?.[0]?.text ?? '',
          contents: _contents
        })

      })

    })

  })

  return {
    chips: _chips,
    contents: _container,
    continuation: _continuation
  }
}
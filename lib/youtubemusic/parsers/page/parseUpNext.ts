import parseSong, { Song } from '../object/parseSong.ts'
import parseItemType from '../component/parseItemType.ts'
import parseVideo, { Video } from '../object/parseVideo.ts'
import { Let, LoopThrough, When } from '../../../tools/inline.ts'
import parseContinuation from '../component/parseContinuation.ts'

type Track = Song | Video

interface Chip {
  title: string,
  playlistId: string
}

interface UpNext {
  chips: Chip[],
  tracks: Track[],
  continuation?: string
}

export default (rawRes: any): UpNext => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _chips: Chip[] = []
  const _tracks: Track[] = []
  const _continuation: string | undefined = parseContinuation(rawRes?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer?.continuations?.[0])

  // Parse album info
  Let(rawRes?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.musicQueueRenderer, (sharedTab) => {

    LoopThrough(sharedTab?.subHeaderChipCloud?.chipCloudRenderer?.chips, (_, eachChip: any) => {
      const _chipTitle = eachChip?.chipCloudChipRenderer.text?.runs?.[0]?.text
      const _chipPlaylistId = eachChip?.chipCloudChipRenderer?.navigationEndpoint?.queueUpdateCommand?.fetchContentsCommand?.watchEndpoint?.playlistId

      if (_chipTitle && _chipPlaylistId) _chips.push({ title: _chipTitle, playlistId: _chipPlaylistId })
    })

    LoopThrough(sharedTab?.content?.playlistPanelRenderer?.contents, (_, eachItem: any) => {
      const _itemRenderer = eachItem?.playlistPanelVideoRenderer
      const _contentType = parseItemType(_itemRenderer?.navigationEndpoint)

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
        }
      )
    })
  })

  return {
    chips: _chips,
    tracks: _tracks,
    continuation: _continuation
  }
}
import Client from '../client/client.ts'
import Referer from './declarations/referer.ts'
import Endpoint from './declarations/endpoint.ts'
import { isNullOrEmpty } from '../tools/inline.ts'
import parseHome from './parsers/page/parseHome.ts'
import parseSearch from './parsers/page/parseSearch.ts'
import parseExplore from './parsers/page/parseExplore.ts'
import parseNewReleases from './parsers/page/parseNewReleases.ts'
import parseMoodsAndGernes from './parsers/page/parseMoodsAndGernes.ts'
import { CONTEXT_ANDROID, CONTEXT_WEB } from './declarations/context.ts'
import parseAlbum from './parsers/page/parseAlbum.ts'
import parsePlaylist from './parsers/page/parsePlaylist.ts'
import parsePlayer from './parsers/page/parsePlayer.ts'
import parseArtist from './parsers/page/parseArtist.ts'

export default class YouTubeMusic {

  private clientWeb: Client
  private clientAndroid: Client

  private ctxWeb = structuredClone(CONTEXT_WEB)
  private ctxAndroid = structuredClone(CONTEXT_ANDROID)

  private KEY_WEB = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30'
  private KEY_ANDROID = 'AIzaSyAOghZGza2MQSZkY_zfZ370N-PUdXEo8AI'

  constructor() {
    this.clientAndroid = new Client('https', 'music.youtube.com')
      .withMaxRetries(10)
      .withModifier((uri, headers) => {
        uri.searchParams.set('prettyPrint', 'false')
        uri.searchParams.set('key', this.KEY_ANDROID)
        headers.set('content-type', 'application/json')
      })

    this.clientWeb = new Client('https', 'music.youtube.com')
      .withMaxRetries(10)
      .withModifier((uri, headers) => {
        uri.searchParams.set('prettyPrint', 'false')
        uri.searchParams.set('key', this.KEY_WEB)
        headers.set('content-type', 'application/json')
      })
  }

  withVisitorId(id: string): YouTubeMusic {
    this.ctxWeb.client.visitorData = id
    this.ctxAndroid.client.visitorData = id
    return this
  }

  private _logError(err: any) {
    if (!(err instanceof Error)) return
  }

  async home(continuation?: string) {
    let responseAsJson
    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        if (!continuation) {
          it.headers.append('referer', Referer.EXPLORE)
          it.body.setBody({ browseId: 'FEmusic_home', context: this.ctxWeb })
        } else {
          it.headers.set('referer', Referer.DEFAULT)
          it.body.setBody({ context: this.ctxWeb })
          it.searchParams.set('type', 'next')
          it.searchParams.set('continuation', continuation)
        }
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseHome(responseAsJson) : undefined
  }

  async artist(browseId: string) {
    let responseAsJson
    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        if (isNullOrEmpty(browseId)) throw new Error('Browse Id is required')
        it.headers.append('referer', Referer.EXPLORE)
        it.body.setBody({ browseId, context: this.ctxWeb })
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseArtist(responseAsJson) : undefined
  }

  async explore(continuation?: string) {
    let responseAsJson

    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        if (!continuation) {
          it.headers.append('referer', Referer.DEFAULT)
          it.body.setBody({ browseId: 'FEmusic_explore', context: this.ctxWeb })
        } else {
          it.headers.set('referer', Referer.DEFAULT)
          it.body.setBody({ context: this.ctxWeb })
          it.searchParams.set('type', 'next')
          it.searchParams.set('continuation', continuation)
        }
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseExplore(responseAsJson) : undefined
  }

  async newReleases() {
    let responseAsJson

    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        it.headers.append('referer', Referer.EXPLORE)
        it.body.setBody({ browseId: 'FEmusic_new_releases', context: this.ctxWeb })
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseNewReleases(responseAsJson) : undefined
  }

  async moodsAndGernes() {
    let responseAsJson

    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        it.headers.append('referer', Referer.EXPLORE)
        it.body.setBody({ browseId: 'FEmusic_moods_and_genres', context: this.ctxWeb })
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseMoodsAndGernes(responseAsJson) : undefined
  }

  async search(query?: string, continuation?: string, filterParam?: string) {
    let responseAsJson

    try {
      const response = await this.clientWeb.post(Endpoint.SEARCH, (it) => {
        if (continuation && !isNullOrEmpty(continuation)) {
          it.searchParams.set('type', 'next')
          it.searchParams.set('continuation', continuation)
          it.body.setBody({ context: this.ctxWeb })
        } else if (!isNullOrEmpty(query)) {
          it.body.setBody({ query, context: this.ctxWeb, params: filterParam })
        } else {
          throw new Error('One of query or continuation is required')
        }
        it.headers.set('referer', Referer.SEARCH)
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parseSearch(responseAsJson) : undefined
  }

  async album(browseId: string) {
    let responseAsJson
    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        if (isNullOrEmpty(browseId)) throw new Error('Browse Id is required')
        it.body.setBody({ browseId, context: this.ctxWeb })
        it.headers.set('referer', Referer.BROWSE)
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }

    return responseAsJson ? parseAlbum(responseAsJson) : undefined
  }

  async playlist(browseId?: string, continuation?: string) {
    let responseAsJson
    try {
      const response = await this.clientWeb.post(Endpoint.BROWSE, (it) => {
        if (continuation && !isNullOrEmpty(continuation)) {
          it.searchParams.set('type', 'next')
          it.searchParams.set('continuation', continuation)
          it.body.setBody({ context: this.ctxWeb })
        } else if (!isNullOrEmpty(browseId)) {
          it.body.setBody({ browseId, context: this.ctxWeb })
        } else {
          throw new Error('One of browse Id or continuation is required')
        }
        it.headers.set('referer', Referer.DEFAULT)
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parsePlaylist(responseAsJson) : undefined
  }

  async player(videoId: string) {
    let responseAsJson
    try {
      const response = await this.clientAndroid.post(Endpoint.PLAYER, (it) => {
        if (isNullOrEmpty(videoId)) throw new Error('Video Id is required')
        it.headers.append('referer', Referer.DEFAULT)
        it.body.setBody({ videoId, context: this.ctxAndroid })
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson ? parsePlayer(responseAsJson) : undefined
  }

  async upNext(videoId: string, playlistId: string) {
    let responseAsJson
    try {
      const response = await this.clientWeb.post(Endpoint.NEXT, (it) => {
        if (isNullOrEmpty(videoId)) throw new Error('Video Id is required')
        it.headers.append('referer', Referer.DEFAULT)
        it.body.setBody({ videoId, playlistId, context: this.ctxWeb })
      })
      responseAsJson = await response.json()
    } catch (_) {
      responseAsJson = undefined
    }
    return responseAsJson
  }

}
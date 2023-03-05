import Random from '../tools/random.ts'
import { isNullOrEmpty } from '../tools/inline.ts'

type BodyInit = string
  | Blob
  | BufferSource
  | URLSearchParams
  | FormData
  | ReadableStream<Uint8Array>
  | Record<string, unknown>
  | null
  | undefined

interface Body {
  setBody: (body: BodyInit) => void
}

export default class Client {

  private url: URL
  private maxRetries = 7
  private retries = new Map<string, number>()
  private headers: Headers = new Headers()

  constructor(scheme: 'http' | 'https', host: string) {
    this.url = new URL(scheme + '://' + host)
  }

  withModifier(modifier: (url: URL, headers: Headers) => void): Client {
    modifier(this.url, this.headers)
    return this
  }

  withMaxRetries(retries: number): Client {
    this.maxRetries = retries
    return this
  }

  async get(
    endpoint: string,
    callback?: (it: {
      headers: Headers,
      searchParams: URLSearchParams
    }) => void,
    requestSession?: string
  ): Promise<Response> {
    if (typeof requestSession !== 'string' || isNullOrEmpty(requestSession)) requestSession = Random()
    if (!this.retries.has(requestSession)) this.retries.set(requestSession, this.maxRetries)

    const uri = new URL(endpoint, this.url.origin)
    const headers = new Headers(this.headers)
    if (callback) callback({ headers, searchParams: uri.searchParams })

    let response

    try {
      response = await fetch(uri, { method: 'GET', headers })
      this.retries.delete(requestSession)
    } catch (err) {
      const retriesRemaining = this.retries.get(requestSession) as number
      if (retriesRemaining < 1) throw err
      this.retries.set(requestSession, retriesRemaining)
      response = await this.get(endpoint, callback, requestSession)
    }

    return response
  }

  async post(
    endpoint: string,
    callback?: (it: {
      headers: Headers,
      searchParams: URLSearchParams,
      body: Body
    }) => void,
    requestSession?: string
  ): Promise<Response> {
    if (typeof requestSession !== 'string' || isNullOrEmpty(requestSession)) requestSession = Random()
    if (!this.retries.has(requestSession)) this.retries.set(requestSession, this.maxRetries)

    let rawBody: BodyInit = null
    const uri = new URL(endpoint, this.url.origin)
    const headers = new Headers(this.headers)
    const body: Body = {
      setBody: (body: BodyInit) => {
        rawBody = body
      }
    }
    if (callback) callback({ headers, searchParams: uri.searchParams, body })
    if (typeof rawBody === 'object' && rawBody !== null) rawBody = JSON.stringify(rawBody)

    let response

    try {
      response = await fetch(uri, { method: 'POST', headers, body: rawBody })
      this.retries.delete(requestSession)
    } catch (err) {
      const retriesRemaining = this.retries.get(requestSession) as number
      if (retriesRemaining < 1) throw err
      this.retries.set(requestSession, retriesRemaining)
      response = await this.post(endpoint, callback, requestSession)
    }

    return response
  }

}
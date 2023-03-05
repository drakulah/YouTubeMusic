export interface YouTubeMusicBodyClient {
  gl                 : string,
  hl                 : string,
  clientName         : string,
  visitorData        : string,
  clientVersion      : string,
  androidSdkVersion? : number
}

export interface YouTubeMusicContext {
  client: YouTubeMusicBodyClient
}

const visitorData = 'CgtZSnJrUVBSV2owSSj52sudBg%3D%3D'

const client: YouTubeMusicBodyClient = {
  gl                 : 'US',
  hl                 : 'en',
  clientName         : 'WEB_REMIX',
  clientVersion      : '1.20230104.01.00',
  visitorData        : visitorData
}

const androidClient: YouTubeMusicBodyClient = {
  androidSdkVersion  : 32,
  gl                 : 'US',
  hl                 : 'en',
  clientName         : 'ANDROID_MUSIC',
  clientVersion      : '5.39.52',
  visitorData        : visitorData
}

export const CONTEXT_WEB: YouTubeMusicContext     = { client: client }
export const CONTEXT_ANDROID: YouTubeMusicContext = { client: androidClient }
import { Let } from '../../../tools/inline.ts'

export default (raw?: any): string | undefined => {
  let res: string | undefined
  
  Let(raw?.nextContinuationData?.continuation, (it) => {
    if (typeof it === 'string') res = it
  })

  return res
}
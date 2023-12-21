import { http } from '@/utils/http/index'

type ListResult = {
  code: number
  msg: string
  data: any
}

export const getDemo = (): Promise<ListResult> => http.request('1111')

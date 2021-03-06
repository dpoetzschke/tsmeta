import { OasFormat } from '../enums/oas.format.enum'
/**
 * interface PropertyParam
 */
export interface PropertyParam {
  enum?: string[] // tslint:disable-line no-reserved-keywords
  format?: OasFormat
  required?: boolean
  version?: string
}
/**
 * interface ParameterParam
 */
export interface ParameterParam {
  name: string
  description?: string
  required: Array<boolean | string> | boolean
  in?: string // tslint:disable-line no-reserved-keywords
  ref?: any
  version?: string
  schema?: any
  example?: any
}
/**
 * interface SuccessResponseParam
 */
export interface ResponseParam {
  description?: string
  example?: any
  ref?: any
  responseRef?: any
  schema?: any
  statusCode?: number
  version?: string
}
/**
 * interface ModelParam
 */
export interface ModelParam {
  version?: string
  example?: any
}

import { ModelParam, PropertyParam } from '../../resources/annotation.schema'
import { Schema } from '../../resources/openapispec'
import { OasConfig } from '../../resources/tsmeta.config'
import { TsDecorator, TsProperty } from '../../resources/tsmeta.schema'
import { TypescriptTypes } from '../../resources/typescript.types.enum'

/**
 * class OasSchemaGenerator
 */
class OasSchemaGenerator {

  constructor(private oasConfig: OasConfig) {}

  /**
   * generate schema
   */
  public generate(modelParam: ModelParam, tsProperty: TsProperty): { [key: string]: Schema } {
    const schemaObj: { [key: string]: Schema } = {}
    let propertyDecorator: TsDecorator
    let propertyParam: PropertyParam

    if (tsProperty.decorators) {
      propertyDecorator = tsProperty.decorators.find((tsDecorator: TsDecorator) => tsDecorator.name === this.mapAnnotations(tsDecorator.name))
      propertyParam = propertyDecorator.tsarguments.pop().representation
    }

    schemaObj[tsProperty.name] = this.createSubSchema(tsProperty, propertyParam)

    return schemaObj
  }

  /**
   * create definition subschema
   */
  private createSubSchema(tsProperty: TsProperty, propertyParam: PropertyParam): Schema {
    let schema: Schema = {}
    const version: string = propertyParam && propertyParam.version || 'v1'

    switch (tsProperty.tstype.typescriptType) {
      case TypescriptTypes.ARRAY:
        const typeName: string = <string> tsProperty.tstype.basicType

        if (['any', 'boolean', 'number', 'string'].includes(typeName)) schema = { type: 'array', items: { type: typeName } }
        else schema = { type: 'array', items: { $ref: `#/components/schemas/${typeName}_${version}` } }
        break
      case TypescriptTypes.BASIC:
        schema = { type: <string> tsProperty.tstype.basicType }
        break
      case TypescriptTypes.MAP:
        const propertiesType: string = <string> tsProperty.tstype.valueType
        let _type: string
        let $ref: string

        if (['any', 'boolean', 'number', 'string'].includes(propertiesType))  _type = propertiesType
        else $ref = `#/components/schemas/${propertiesType}_${version}`

        schema = { type: 'object', additionalProperties: { type: _type, $ref } }
        break
      case TypescriptTypes.MULTIPLE:
        schema = { type: (<string[]> tsProperty.tstype.basicType).join('|') }
        break
      case TypescriptTypes.PROMISE:
        schema = { type: <string> tsProperty.tstype.valueType }
        break
      case TypescriptTypes.PROP:
        const properties: { [key: string]: Schema } = {}
        const keyTypes: string[] = <string[]> tsProperty.tstype.keyType

        keyTypes.forEach((key: string, index: number) => {
          const value: string = tsProperty.tstype.valueType[index]

          if (['any', 'boolean', 'number', 'string'].includes(value))  properties[key] = { type: value }
          else properties[key] = { $ref: `#/components/schemas/${value}_${version}` }
        })

        schema = { type: 'object', properties }
        break
      case TypescriptTypes.REFERENCE:
        schema = { type: 'object', $ref: `#/components/schemas/${tsProperty.tstype.basicType}_${version}` }
        break
      case TypescriptTypes.UNTYPED:
        schema = { type: 'any' }
        break
      default:
    }

    if (propertyParam && propertyParam.format) schema.format = <string> propertyParam.format

    return schema
  }

  /**
   * fetch standard mapping annotation by used annotation
   */
  private mapAnnotations(used: string): string {
    return this.oasConfig.annotationsMap[used] || used
  }
}

export { OasSchemaGenerator }
import { GraphQLConfig } from '../lib/tsmeta.config'
import { TsDecorator, TsFile, TsMeta, TsProgram } from '../lib/tsmeta.schema'
import { GraphQLSchemaGenerator } from './graphql.generators/graphql.schema.generator'

/**
 * class GraphQLGenerator
 */
class GraphQLGenerator {

  private graphQLSchemaGenerator: GraphQLSchemaGenerator = new GraphQLSchemaGenerator(this.graphQLConfig)

  constructor(private graphQLConfig: GraphQLConfig) {}

  /**
   * generate GraphQLSchema files
   * @param tsMeta
   */
  public generate(tsMeta: TsMeta): { [key: string]: string } {
    const graphQLSchema: { [key: string]: string } = {}

    const models: TsFile[] = this.filterModel(tsMeta)

    graphQLSchema.Any = 'union Any = Boolean | Int | Float | String'

    models.forEach((model: TsFile) => {
      graphQLSchema[model.tsClass.name] = this.graphQLSchemaGenerator.generate(model.tsClass)
    })

    return graphQLSchema
  }
  /**
   * filter TsMeta schema for Model annotated classes
   */
  private filterModel(tsMeta: TsMeta): TsFile[] {
    const modelAnnotation: string = this.graphQLConfig.model_annotation || 'Model'

    const tsFiles: TsFile[] = []

    tsMeta.programs.forEach((tsProgram: TsProgram) => {
      tsProgram.files.forEach((tsFile: TsFile) => {
        if (tsFile.tsClass
          && tsFile.tsClass.decorators
          && tsFile.tsClass.decorators.some((tsDecorator: TsDecorator) => tsDecorator.name === modelAnnotation)) {
          tsFiles.push(tsFile)
        }
      })
    })

    return tsFiles
  }
}

export { GraphQLGenerator }
import { Expression, ObjectLiteralExpression, SyntaxKind } from 'typescript'
import { TsArgument } from '../../lib/interfaces/tsmeta.schema'
import { ExpressionToString } from '../../lib/utils/expression.to.string'
import { ObjectLiteralExpressionToString } from '../../lib/utils/object.literal.expression.to.string'

/**
 * class TsMetaArgumentFactory
 */
class TsMetaArgumentFactory {

  /**
   * build TsArgument element
   */
  public build(expression: Expression, show?: boolean): TsArgument {
    let representation: string

    switch (expression.kind) {
      case SyntaxKind.NumericLiteral:
        representation = ExpressionToString(expression)
        break
      case SyntaxKind.StringLiteral:
        representation = ExpressionToString(expression)
        break
      case SyntaxKind.ObjectLiteralExpression:
        representation = ObjectLiteralExpressionToString(expression as ObjectLiteralExpression)
        break
      default:
    }

    return {
      representation
    }
  }
}

export { TsMetaArgumentFactory }

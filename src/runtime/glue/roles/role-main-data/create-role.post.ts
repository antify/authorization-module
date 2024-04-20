import {
  useValidator,
  isTypeOfRule,
  Types,
  notBlankRule
} from '@antify/validate'

export type Input = {
  name: string
  isAdmin: boolean
  permissions: string[]
};
export const validator = useValidator({
  name: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  isAdmin: [(val: unknown) => isTypeOfRule(val, Types.BOOLEAN)],
  permissions: [(val: unknown) => isTypeOfRule(val, Types.ARRAY)]
})

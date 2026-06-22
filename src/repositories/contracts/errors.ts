export class AuthRequiredError extends Error {
  readonly returnTo: string

  constructor(returnTo: string) {
    super("로그인이 필요한 행동입니다.")
    this.name = "AuthRequiredError"
    this.returnTo = returnTo
  }
}

export class RepositoryConfigError extends Error {
  readonly missingKeys: readonly string[]

  constructor(missingKeys: readonly string[]) {
    super(`Supabase 설정이 필요합니다: ${missingKeys.join(", ")}`)
    this.name = "RepositoryConfigError"
    this.missingKeys = missingKeys
  }
}

export class ValidationError extends Error {
  readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.name = "ValidationError"
    this.field = field
  }
}

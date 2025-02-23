# [4.0.0](https://github.com/aguirresabino/nestjs-logger/compare/v3.0.0...v4.0.0) (2025-02-23)


* refactor!: remove getDefaultLoggerToken ([5ab56f6](https://github.com/aguirresabino/nestjs-logger/commit/5ab56f63679377f08789cbeff5c0baa99a4afc07))
* refactor!: rename LoggerConfigFactory to LoggerModuleOptionsFactory across the codebase ([66d744e](https://github.com/aguirresabino/nestjs-logger/commit/66d744e6a6f87576ee633a97fc739f6f04c40e7f))
* refactor!: rename LoggerConfigOptions to LoggerModuleOptions across the codebase ([ef8be67](https://github.com/aguirresabino/nestjs-logger/commit/ef8be672b73463f689213601bf6e3e354da7cc71))


### BREAKING CHANGES

* rename LoggerConfigFactory to LoggerModuleOptionsFactory
* rename LoggerConfigOptions to LoggerModuleOptions
* remove getDefaultLoggerToken

# [3.0.0](https://github.com/aguirresabino/nestjs-logger/compare/v2.0.1...v3.0.0) (2025-01-21)


* feat!: update LoggerConfigOptions interface ([ee3844e](https://github.com/aguirresabino/nestjs-logger/commit/ee3844ec0e130e66abc6cacae801a5db634b8066))


### BREAKING CHANGES

* modifies the interface to accept the
pino configuration when loading the LoggerModule using
forRoot or forRootAsync

# [2.0.1](https://github.com/aguirresabino/nestjs-logger/compare/v1.1.0...v2.0.1) (2025-01-20)


* chore!: update nestjs monorepo to v11 ([ef6839f](https://github.com/aguirresabino/nestjs-logger/commit/ef6839f2a455389f5207b2383391df3fa34cdaa0))


### BREAKING CHANGES

* update nestjs monorepo to v11 ([ef6839f](https://github.com/aguirresabino/nestjs-logger/commit/ef6839f2a455389f5207b2383391df3fa34cdaa0))

# [1.1.0](https://github.com/aguirresabino/nestjs-logger/compare/v1.0.0...v1.1.0) (2025-01-18)


### Features

* allow config logger module ([44c0072](https://github.com/aguirresabino/nestjs-logger/commit/44c0072420ad056c6835dbcb11a37604e2bdf78f))
* allow config module using forRoot ([12b9fea](https://github.com/aguirresabino/nestjs-logger/commit/12b9fea82d3d194afafa689197e388f04df6b4d5))

# 1.0.0 (2025-01-13)


### Features

* allows creating an AppLogger using a custom LoggerConfigOptions ([b07b70c](https://github.com/aguirresabino/nestjs-logger/commit/b07b70c84558cee915e008a616970e3118ebe52c))
* initial commit with library code ([d8d6a0c](https://github.com/aguirresabino/nestjs-logger/commit/d8d6a0c481cf64db18f83a86b725f85841277013))

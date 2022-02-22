# CDK Serverless boilerplate

Opinionated boilerplate for serverless projects on AWS using CDK (backend services and infrastructure)

## Getting started

Pre-requirements:

- [node v8+](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)
- typescript
- aws cli
- cdk

Bootstrap project

```
yarn && yarn generate
```

Deploy services to development

```
yarn cd:deploy dev
```

### AWS Profile

You'll need an AWS profile setup to access all associated roles required to execute services.

Configure your AWS profiles before running any development services or deployment commands.

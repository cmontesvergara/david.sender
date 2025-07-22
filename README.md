<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
notibot
├─ .dockerignore
├─ .prettierrc
├─ Dockerfile
├─ README.md
├─ auth
├─ captain-definition
├─ dist
│  ├─ adapters
│  │  ├─ in
│  │  │  ├─ rest-api
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-event.dto.d.ts
│  │  │  │  │  ├─ create-event.dto.js
│  │  │  │  │  ├─ create-event.dto.js.map
│  │  │  │  │  ├─ send-notification.dto.d.ts
│  │  │  │  │  ├─ send-notification.dto.js
│  │  │  │  │  ├─ send-notification.dto.js.map
│  │  │  │  │  ├─ suscribe-to-event.dto.d.ts
│  │  │  │  │  ├─ suscribe-to-event.dto.js
│  │  │  │  │  └─ suscribe-to-event.dto.js.map
│  │  │  │  ├─ events.controller.d.ts
│  │  │  │  ├─ events.controller.js
│  │  │  │  ├─ events.controller.js.map
│  │  │  │  ├─ notifications.controller.d.ts
│  │  │  │  ├─ notifications.controller.js
│  │  │  │  └─ notifications.controller.js.map
│  │  │  └─ telegram
│  │  │     ├─ interfaces
│  │  │     │  ├─ context.interface.d.ts
│  │  │     │  ├─ context.interface.js
│  │  │     │  └─ context.interface.js.map
│  │  │     └─ scenes
│  │  │        ├─ create-chat
│  │  │        │  ├─ create-chat.scene.d.ts
│  │  │        │  ├─ create-chat.scene.js
│  │  │        │  ├─ create-chat.scene.js.map
│  │  │        │  ├─ create-chat.update.d.ts
│  │  │        │  ├─ create-chat.update.js
│  │  │        │  └─ create-chat.update.js.map
│  │  │        └─ menu
│  │  │           ├─ menu.update.d.ts
│  │  │           ├─ menu.update.js
│  │  │           └─ menu.update.js.map
│  │  └─ out
│  │     ├─ prisma-chat-repository.adapter.d.ts
│  │     ├─ prisma-chat-repository.adapter.js
│  │     ├─ prisma-chat-repository.adapter.js.map
│  │     ├─ prisma-event-repository.adapter.d.ts
│  │     ├─ prisma-event-repository.adapter.js
│  │     ├─ prisma-event-repository.adapter.js.map
│  │     ├─ prisma-event-suscription-repository.adapter.d.ts
│  │     ├─ prisma-event-suscription-repository.adapter.js
│  │     ├─ prisma-event-suscription-repository.adapter.js.map
│  │     ├─ telegraf-notification-sender.adapter.d.ts
│  │     ├─ telegraf-notification-sender.adapter.js
│  │     └─ telegraf-notification-sender.adapter.js.map
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ app.service.d.ts
│  ├─ app.service.js
│  ├─ app.service.js.map
│  ├─ application
│  │  └─ use-cases
│  │     ├─ create-chat.use-case.d.ts
│  │     ├─ create-chat.use-case.js
│  │     ├─ create-chat.use-case.js.map
│  │     ├─ create-event.use-case.d.ts
│  │     ├─ create-event.use-case.js
│  │     ├─ create-event.use-case.js.map
│  │     ├─ send-notification-to-chat.use-case.d.ts
│  │     ├─ send-notification-to-chat.use-case.js
│  │     ├─ send-notification-to-chat.use-case.js.map
│  │     ├─ subscribe-to-event.use-case.d.ts
│  │     ├─ subscribe-to-event.use-case.js
│  │     └─ subscribe-to-event.use-case.js.map
│  ├─ common
│  │  ├─ events
│  │  │  ├─ internal-socket-events.d.ts
│  │  │  ├─ internal-socket-events.js
│  │  │  └─ internal-socket-events.js.map
│  │  └─ logger
│  │     ├─ logger.module.d.ts
│  │     ├─ logger.module.js
│  │     ├─ logger.module.js.map
│  │     ├─ logger.service.d.ts
│  │     ├─ logger.service.js
│  │     ├─ logger.service.js.map
│  │     ├─ request-context.d.ts
│  │     ├─ request-context.js
│  │     ├─ request-context.js.map
│  │     ├─ request-logger.d.ts
│  │     ├─ request-logger.helper.d.ts
│  │     ├─ request-logger.helper.js
│  │     ├─ request-logger.helper.js.map
│  │     ├─ request-logger.js
│  │     └─ request-logger.js.map
│  ├─ domain
│  │  ├─ entities
│  │  │  ├─ chat.entity.d.ts
│  │  │  ├─ chat.entity.js
│  │  │  ├─ chat.entity.js.map
│  │  │  ├─ event-otp.entity.d.ts
│  │  │  ├─ event-otp.entity.js
│  │  │  ├─ event-otp.entity.js.map
│  │  │  ├─ event.entity.d.ts
│  │  │  ├─ event.entity.js
│  │  │  └─ event.entity.js.map
│  │  └─ interfaces
│  │     ├─ chat-repository.interface.d.ts
│  │     ├─ chat-repository.interface.js
│  │     ├─ chat-repository.interface.js.map
│  │     ├─ event-repository.interface.d.ts
│  │     ├─ event-repository.interface.js
│  │     ├─ event-repository.interface.js.map
│  │     ├─ event-subscription-repository.interface.d.ts
│  │     ├─ event-subscription-repository.interface.js
│  │     ├─ event-subscription-repository.interface.js.map
│  │     ├─ notification-sender.interface.d.ts
│  │     ├─ notification-sender.interface.js
│  │     └─ notification-sender.interface.js.map
│  ├─ infrastructure
│  │  ├─ chat
│  │  │  ├─ chat.module.d.ts
│  │  │  ├─ chat.module.js
│  │  │  └─ chat.module.js.map
│  │  ├─ event
│  │  │  ├─ event.module.d.ts
│  │  │  ├─ event.module.js
│  │  │  └─ event.module.js.map
│  │  ├─ notification
│  │  │  ├─ notification.module.d.ts
│  │  │  ├─ notification.module.js
│  │  │  └─ notification.module.js.map
│  │  ├─ prisma
│  │  │  ├─ prisma.module.d.ts
│  │  │  ├─ prisma.module.js
│  │  │  ├─ prisma.module.js.map
│  │  │  ├─ prisma.service.d.ts
│  │  │  ├─ prisma.service.js
│  │  │  └─ prisma.service.js.map
│  │  ├─ scenes
│  │  │  ├─ scenes.module.d.ts
│  │  │  ├─ scenes.module.js
│  │  │  └─ scenes.module.js.map
│  │  └─ telegram
│  │     ├─ telegram.module.d.ts
│  │     ├─ telegram.module.js
│  │     └─ telegram.module.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  ├─ shared
│  │  └─ formatters
│  │     ├─ index.d.ts
│  │     ├─ index.js
│  │     ├─ index.js.map
│  │     ├─ message-formatter.d.ts
│  │     ├─ message-formatter.js
│  │     └─ message-formatter.js.map
│  ├─ tsconfig.build.tsbuildinfo
│  └─ whatsapp
│     ├─ baileys.client.d.ts
│     ├─ baileys.client.js
│     ├─ baileys.client.js.map
│     ├─ whatsapp.gateway.d.ts
│     ├─ whatsapp.gateway.js
│     ├─ whatsapp.gateway.js.map
│     ├─ whatsapp.service.d.ts
│     ├─ whatsapp.service.js
│     └─ whatsapp.service.js.map
├─ eslint.config.mjs
├─ front.html
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ adapters
│  │  ├─ in
│  │  │  ├─ rest-api
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-event.dto.ts
│  │  │  │  │  ├─ send-notification.dto.ts
│  │  │  │  │  └─ suscribe-to-event.dto.ts
│  │  │  │  ├─ events.controller.ts
│  │  │  │  └─ notifications.controller.ts
│  │  │  └─ telegram
│  │  │     ├─ interfaces
│  │  │     │  └─ context.interface.ts
│  │  │     └─ scenes
│  │  │        ├─ create-chat
│  │  │        │  ├─ create-chat.scene.ts
│  │  │        │  └─ create-chat.update.ts
│  │  │        └─ menu
│  │  │           └─ menu.update.ts
│  │  └─ out
│  │     ├─ prisma-chat-repository.adapter.ts
│  │     ├─ prisma-event-repository.adapter.ts
│  │     ├─ prisma-event-suscription-repository.adapter.ts
│  │     └─ telegraf-notification-sender.adapter.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ application
│  │  └─ use-cases
│  │     ├─ create-chat.use-case.ts
│  │     ├─ create-event.use-case.ts
│  │     ├─ send-notification-to-chat.use-case.ts
│  │     └─ subscribe-to-event.use-case.ts
│  ├─ common
│  │  ├─ events
│  │  │  └─ internal-socket-events.ts
│  │  └─ logger
│  │     ├─ logger.module.ts
│  │     ├─ logger.service.ts
│  │     ├─ request-context.ts
│  │     ├─ request-logger.helper.ts
│  │     └─ request-logger.ts
│  ├─ domain
│  │  ├─ entities
│  │  │  ├─ chat.entity.ts
│  │  │  ├─ event-otp.entity.ts
│  │  │  └─ event.entity.ts
│  │  └─ interfaces
│  │     ├─ chat-repository.interface.ts
│  │     ├─ event-repository.interface.ts
│  │     ├─ event-subscription-repository.interface.ts
│  │     └─ notification-sender.interface.ts
│  ├─ infrastructure
│  │  ├─ chat
│  │  │  └─ chat.module.ts
│  │  ├─ event
│  │  │  └─ event.module.ts
│  │  ├─ notification
│  │  │  └─ notification.module.ts
│  │  ├─ prisma
│  │  │  ├─ prisma.module.ts
│  │  │  ├─ prisma.service.ts
│  │  │  └─ schema.prisma
│  │  ├─ scenes
│  │  │  └─ scenes.module.ts
│  │  └─ telegram
│  │     └─ telegram.module.ts
│  ├─ main.ts
│  ├─ shared
│  │  └─ formatters
│  │     ├─ index.ts
│  │     └─ message-formatter.ts
│  └─ whatsapp
│     ├─ baileys.client.ts
│     ├─ whatsapp.gateway.ts
│     └─ whatsapp.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
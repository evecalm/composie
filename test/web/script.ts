import Composie from '../../src/composie'
const harbor = new Composie()
harbor.use(function (ctx, next) {
  console.log('request from channel', ctx.channel)
  if (ctx.request && ctx.request.cmd === 'danger') {
    ctx.response = 'cmd not allowed'
  } else {
    // next();
    next()
  }
})

harbor.use('api/', function (ctx, next) {
  ctx.from = +new Date()
  next()
})

harbor.use('view/', function (ctx, next) {
  if (!ctx.request) throw new Error('bad request')
  ctx.from = +new Date()
  next()
})

// add one router
harbor.route('api/user-info', function (ctx, next) {
  ctx.response = 'request at ' + ctx.from + JSON.stringify(ctx.request)
})

harbor.route({
  'api/users': function (ctx, next) {
    ctx.response = {
      from: ctx.from,
      list: ['user1', 'user2']
    }
  },
  'view/home': function (ctx, next) {
    ctx.response = 'This is home page ' + ctx.request
  }
})

// harbor
//   .run('api/user-info', { cmd: 'danger' })
//   .then(function (resp) {
//     console.log(resp)
//     // => cmd not allowed
//   })

harbor
  .run('view/home')
  .then(resp => {
    console.log('view success', resp)
  })
  .catch(err => {
    console.log('tail view error', err)
  })

harbor
  .run({
    channel: 'view/home',
    request: 'sssss'
  })
  .then(resp => {
    console.log('with custom ctx', resp)
  })

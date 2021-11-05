const Router = require('koa-router');
const adminModel = require('../models/admin');

const router = Router({
   prefix: '/api/v1.0/admin'
});


router.post('/create_db', async (ctx, next) => {
      let item = await adminModel.createTables(ctx.params.id);
      ctx.body = item;
});

module.exports = router; 
const Sequelize = require('sequelize');
const { findModules } = require('../utils');
const createModelRouter = require('./modelRouter');
const BaseModel = require('./base');

const { getLogger } = require('../log');

const logger = getLogger();

module.exports = (dir, { username, password, database, host, pool }, app) => {
  const sequelize = new Sequelize(database, username, password, {
    host,
    pool,
    dialect: 'mysql',
    operatorsAliases: false
  });

  const models = {};

  findModules(dir, mod => {
    const { name, model, routes } = mod(sequelize);

    models[name] = new BaseModel({
      model,
      opts: {
        logging: sql => {
          logger.info(sql);
        }
      }
    });

    if (routes && routes.length) {
      const modelRouter = createModelRouter(name, routes);
      app.apiRouter.use(modelRouter.routes());
      app.apiRouter.use(modelRouter.allowedMethods());
    }
  });

  app.use((ctx, next) => {
    ctx.models = models;
    return next();
  });

  sequelize.sync();

  logger.info('Sync to db...');
};

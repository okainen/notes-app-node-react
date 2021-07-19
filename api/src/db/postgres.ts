import {Sequelize} from 'sequelize';
import config from '@/config';

const sequelize = new Sequelize(config.db.postgres.url);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default new Sequelize(config.db.postgres.url, {logging: false});

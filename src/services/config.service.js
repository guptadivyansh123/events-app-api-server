/**
 * Service to retrieve config KVP from app.config.js
 */
const AppConfig = require('../app.config');
const appConfig = new AppConfig();

const getConfig = () => {
    return appConfig;
}

const getConfigByKey = (key) => {
    const obj = {};
    if(appConfig[key]) {
        obj[key] = appConfig[key];
    } else {
        obj[key] = null;
    }
    return obj;
}

module.exports = {getConfig, getConfigByKey};

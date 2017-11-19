const axios = require('axios');
const nconf = require('nconf');

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const waitForClient = async (baseURL, timeout = 60000, delayDuration = 1000) => {
  let shouldStop = false;
  let error;
  const client = axios.create({ baseURL });
  const checkTimeout = setTimeout(() => (shouldStop = true), timeout);
  while (!shouldStop) {
    try {
      await client.get('/health');
      clearTimeout(checkTimeout);
      return;
    } catch (ex) {
      error = ex;
    }
    await delay(delayDuration);
  }
  console.error(`unable to connect to ${baseURL}`);
  throw error;
};

const services = [nconf.get('EDITOR_URL'), nconf.get('TWEEK_API_URL'), nconf.get('AUTHORING_URL')];

module.exports.waitForAllClients = function() {
  return Promise.all(services.map(s => waitForClient(s)));
};

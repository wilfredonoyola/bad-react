const withPlugins = require('next-compose-plugins');
const sass = require('@zeit/next-sass')

// next.js configuration
const nextConfig = {
  target: 'serverless',
  env: {
    API_URL: 'https://testappservicegeneral.azurewebsites.net/api',
    //API_URL: 'https://futbolify-api.herokuapp.com/api'
  }
};

module.exports = withPlugins([
  [sass],
], nextConfig);
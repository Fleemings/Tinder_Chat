module.exports = {
  port: process.env.PORT,
  uri: process.env.URI,
  local_client_app: process.env.LOCAL_CLIENT_APP,
  remote_client_app: process.env.REMOTE_CLIENT_APP,
  allowedDomains:
    process.env.NODE_DEV === 'production'
      ? [process.env.REMOTE_CLIENT_APP, process.env.REMOTE_URL_SERVER]
      : [process.env.LOCAL_CLIENT_APP, process.env.LOCAL_URL_SERVER],
};

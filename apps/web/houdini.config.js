/* eslint-disable @typescript-eslint/naming-convention */
/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  defaultCachePolicy: 'NetworkOnly',
  //disableMasking: true,
  apiUrl: 'http://localhost:4000/graphql',
  plugins: {
    'houdini-svelte': {
      client: './client',
      globalStorePrefix: 'G_'
      //quietQueryErrors: true,
      //static: true,
    }
  },
  scalars: {
    // the name of the scalar we are configuring
    Date: {
      // the corresponding typescript type
      type: 'Date',
      // turn the api's response into that type
      unmarshal(val) {
        return new Date(val);
      },
      // turn the value into something the API can use
      marshal(date) {
        return date.getTime();
      }
    },
    /* in your case, something like */
    File: {
      // <- The GraphQL Scalar
      type: 'File'
    }
  }
};

export default config;

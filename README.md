# vite-plugin-ssi [![npm](https://img.shields.io/npm/v/vite-plugin-ssi)](https://npmjs.com/package/vite-plugin-ssi)

Server side include for vite

```js
// vite.config.js
import ssi from 'vite-plugin-ssi'

export default {
  plugins: [ssi({
     remoteBasePath: 'http://xxx',
  })]
}
```

## Options

```ts
interface Options {
  /**
   * Apply the plugin only for serve or for build.
   */
  apply?: 'serve' | 'build';
  remoteBasePath: string;
}
```

## License

MIT

import { Plugin } from 'vite'
import got from 'got';

interface Options {
  /**
   * Apply the plugin only for serve or for build.
   */
  apply?: 'serve' | 'build';
  remoteBasePath: string;
}

function getSource(dir: string, opts: Options): Promise<string> {
  const isRemotePath = /https?:\/\//g.test(dir);
  const { remoteBasePath } = opts;
  if (isRemotePath || remoteBasePath) {
    var url = remoteBasePath ? remoteBasePath + dir : dir;
    return new Promise((resolve) => {
      got(url, {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }).then(({ body }) => {
        resolve(body);
      });
    });
  }
  // todo
  return Promise.resolve('');
}

export default function ssi(options: Options) {
  let cache: Record<string, string> = {};
  const plugin: Plugin = {
    apply:options.apply,
    name: 'ssi',
    async transformIndexHtml(html) {
      const files = html.match(
        /<!--#\s*include\s+(file|virtual)=(['"])([^\r\n\s]+?)\2\s*(.*)-->/g,
      );
      if (!files) {
        return Promise.resolve(html);
      }
      const injects = await Promise.all(
        files.map(async (file) => {
          if (cache[file]) {
            return cache[file];
          }
          const name = file.split('"')[1];
          const inject = await getSource(name, options);
          cache[file] = inject;
          return inject;
        }),
      );
      files.forEach((file, idx) => {
        html = html.replace(file, function () {
          return decodeURIComponent(encodeURIComponent(injects[idx]));
        });
      });
      return html;
    },
  };

  return plugin;
};

module.exports = ssi;
ssi['default'] = ssi;

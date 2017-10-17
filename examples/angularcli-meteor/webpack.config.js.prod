const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const { NoEmitOnErrorsPlugin, EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const { BaseHrefWebpackPlugin, SuppressExtractedTextChunksWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin, ModuleConcatenationPlugin, UglifyJsPlugin } = require('webpack').optimize;
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
const minimizeCss = true;
const baseHref = "";
const deployUrl = "";
const postcssPlugins = function () {
        // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
        const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
        const minimizeOptions = {
            autoprefixer: false,
            safe: true,
            mergeLonghand: false,
            discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
        };
        return [
            postcssUrl({
                url: (URL) => {
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    if (!URL.startsWith('/') || URL.startsWith('//')) {
                        return URL;
                    }
                    if (deployUrl.match(/:\/\//)) {
                        // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                        return `${deployUrl.replace(/\/$/, '')}${URL}`;
                    }
                    else if (baseHref.match(/:\/\//)) {
                        // If baseHref contains a scheme, include it as is.
                        return baseHref.replace(/\/$/, '') +
                            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                    else {
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                }
            }),
            autoprefixer(),
        ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
    };




module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true
  },
  "externals": [
    resolveExternals
  ],
  "resolveLoader": {
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      "./src/main.ts"
    ],
    "polyfills": [
      "./src/polyfills.ts"
    ],
    "styles": [
      "./src/styles.scss"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].[chunkhash:20].bundle.js",
    "chunkFilename": "[id].[chunkhash:20].chunk.js"
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /(\\|\/)node_modules(\\|\/)/
        ]
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg|cur)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "loaders": ExtractTextPlugin.extract({
  "use": [
    {
      "loader": "css-loader",
      "options": {
        "sourceMap": false,
        "importLoaders": 1
      }
    },
    {
      "loader": "postcss-loader",
      "options": {
        "ident": "postcss",
        "plugins": postcssPlugins
      }
    }
  ],
  "publicPath": ""
})
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": ExtractTextPlugin.extract({
  "use": [
    {
      "loader": "css-loader",
      "options": {
        "sourceMap": false,
        "importLoaders": 1
      }
    },
    {
      "loader": "postcss-loader",
      "options": {
        "ident": "postcss",
        "plugins": postcssPlugins
      }
    },
    {
      "loader": "sass-loader",
      "options": {
        "sourceMap": false,
        "precision": 8,
        "includePaths": []
      }
    }
  ],
  "publicPath": ""
})
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "loaders": ExtractTextPlugin.extract({
  "use": [
    {
      "loader": "css-loader",
      "options": {
        "sourceMap": false,
        "importLoaders": 1
      }
    },
    {
      "loader": "postcss-loader",
      "options": {
        "ident": "postcss",
        "plugins": postcssPlugins
      }
    },
    {
      "loader": "less-loader",
      "options": {
        "sourceMap": false
      }
    }
  ],
  "publicPath": ""
})
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "loaders": ExtractTextPlugin.extract({
  "use": [
    {
      "loader": "css-loader",
      "options": {
        "sourceMap": false,
        "importLoaders": 1
      }
    },
    {
      "loader": "postcss-loader",
      "options": {
        "ident": "postcss",
        "plugins": postcssPlugins
      }
    },
    {
      "loader": "stylus-loader",
      "options": {
        "sourceMap": false,
        "paths": []
      }
    }
  ],
  "publicPath": ""
})
      },
      {
        "test": /\.ts$/,
        "use": [
          "@ngtools/webpack"
        ]
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "assets/**/*",
          "dot": true
        }
      },
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "favicon.ico",
          "dot": true
        }
      }
    ], {
      "ignore": [
        ".gitkeep"
      ],
      "debug": "warning"
    }),
    new ProgressPlugin(),
    new CircularDependencyPlugin({
      "exclude": /(\\|\/)node_modules(\\|\/)/,
      "failOnError": false
    }),
    new HtmlWebpackPlugin({
      "template": "./src/index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": {
        "caseSensitive": true,
        "collapseWhitespace": true,
        "keepClosingSlash": true
      },
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
            return 1;
        }
        else if (leftIndex < rightindex) {
            return -1;
        }
        else {
            return 0;
        }
    }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "name": [
        "inline"
      ],
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
                return module.resource
                    && (module.resource.startsWith(nodeModules)
                        || module.resource.startsWith(genDirNodeModules)
                        || module.resource.startsWith(realNodeModules));
            },
      "chunks": [
        "main"
      ]
    }),
    new CommonsChunkPlugin({
      "name": [
        "main"
      ],
      "minChunks": 2,
      "async": "common"
    }),
    new ExtractTextPlugin({
      "filename": "[name].[contenthash:20].bundle.css"
    }),
    new SuppressExtractedTextChunksWebpackPlugin(),
    new LicenseWebpackPlugin({
      "licenseFilenames": [
        "LICENSE",
        "LICENSE.md",
        "LICENSE.txt",
        "license",
        "license.md",
        "license.txt"
      ],
      "perChunkOutput": false,
      "outputTemplate": "node_modules/license-webpack-plugin/output.template.ejs",
      "outputFilename": "3rdpartylicenses.txt",
      "suppressErrors": true,
      "includePackagesWithoutLicense": false,
      "abortOnUnacceptableLicense": false,
      "addBanner": false,
      "bannerTemplate": "/*! 3rd party license information is available at <%- filename %> */",
      "includedChunks": [],
      "excludedChunks": [],
      "additionalPackages": [],
      "pattern": /^(MIT|ISC|BSD.*)$/
    }),
    new EnvironmentPlugin({
      "NODE_ENV": "production"
    }),
    new HashedModuleIdsPlugin({
      "hashFunction": "md5",
      "hashDigest": "base64",
      "hashDigestLength": 4
    }),
    new ModuleConcatenationPlugin({}),
    new UglifyJsPlugin({
      "mangle": {
        "screw_ie8": true
      },
      "compress": {
        "screw_ie8": true,
        "warnings": false
      },
      "output": {
        "ascii_only": true
      },
      "sourceMap": false,
      "comments": false
    }),
    new AotPlugin({
      "mainPath": "main.ts",
      "replaceExport": false,
      "hostReplacementPaths": {
        "environments/environment.ts": "environments/environment.prod.ts"
      },
      "exclude": [],
      "tsConfigPath": "src/tsconfig.app.json"
    }),
    new webpack.ProvidePlugin({
      __extends: 'typescript-extends'
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false,
    "__dirname": true
  },
  "devServer": {
    "historyApiFallback": true
  }
};

function resolveExternals(context, request, callback) {
  return resolveMeteor(request, callback) ||
    callback();
}

function resolveMeteor(request, callback) {
  var match = request.match(/^meteor\/(.+)$/);
  var pack = match && match[1];

  if (pack) {
    callback(null, 'Package["' + pack + '"]');
    return true;
  }
}

const fs = require('fs')
const path = require('path')
const types = require('./types.json')

const fromDir = dir => fs.readdirSync(path.join(__dirname, '..', dir)).filter(name => name.match(/.*\.md/) != null).filter(name => name !== 'README.md')

module.exports = () => ({
  title: 'Cmdr',
  description: 'Fully extensible command console for Roblox developers.',

  base: '/Cmdr/',

  plugins: [
    'tabs',
    ['api-docs', {
      defaults: {
        returns: ['void'],
        property_tags: [{
          name: 'read only',
          unless: ['writable']
        }]
      },
      types: {
        void: {
          summary: 'Interchangeable for nil in most cases.'
        },
        ...types
      },
      tagColors: {
        'read only': '#1abc9c',
        'writable': '#3498db',
        'deprecated': '#e7c000',
        'client only': '#349AD5',
        'server only': '#01CC67'
      },
      methodCallOperator: ':',
      staticMethodCallOperator: '.'
    }]
  ],

  markdown: {
    lineNumbers: true,

    extendMarkdown: md => {
      md.use(require('markdown-it-attrs'), {
				leftDelimiter: '{:'
			})
    }
  },

  themeConfig: {
		logo: '/logo.png',
    lastUpdated: true,
    sidebarDepth: 3,
    activeHeaderLinks: false,

    nav: [
      { text: 'Guide', link: '/guide/Setup' },
      { text: 'API Reference', link: '/api/Cmdr' },
      { text: 'Discord', link: 'https://discord.gg/g5PdMxh' },
			{ text: 'GitHub', link: 'https://github.com/evaera/Cmdr' }
    ],

    // .concat(...API.map(page => slugify(page.name))),
    sidebar: {
      '/guide/': [
        'Setup',
        'Commands',
        'Types',
        'Hooks',
        'NetworkEventHandlers',
        'MetaCommands'
      ],
      '/api/': fromDir('api'),
      '/': ['/', 'guide/Setup', 'api/Cmdr']
    }
  }
})
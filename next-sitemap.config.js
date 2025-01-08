/** @type {import('next-sitemap').IConfig} */
module.exports = {
  exclude: ['*/_meta'],
  siteUrl: 'https://docs.inkonchain.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ]
  }
}

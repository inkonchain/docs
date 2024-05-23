import nextra from 'nextra'
import remarkCodeImport from 'remark-code-import'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [
      remarkCodeImport,
    ]
  }
})

const config = withNextra({
  eslint: {
    ignoreDuringBuilds: true,
  },
})

export default config

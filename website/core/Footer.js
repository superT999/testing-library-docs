/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const ExternalLink = props => (
  <a target="_blank" rel="noreferrer noopener" {...props} />
)
const Link = props => <a {...props} />

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    const docsUrl = this.props.config.docsUrl
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    const langPart = `${language ? `${language}/` : ''}`
    return `${baseUrl}${docsPart}${langPart}${doc}`
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + (language ? `${language}/` : '') + doc
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <Link href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </Link>
          <div>
            <h5>Docs</h5>
            <Link href={this.docUrl('intro')}>Getting Started</Link>
            <Link href={this.docUrl('example-codesandbox')}>Examples</Link>
            <Link href={this.docUrl('api-queries')}>API</Link>
            <Link href={this.docUrl('faq')}>Help</Link>
          </div>
          <div>
            <h5>Community</h5>
            <Link href={`${this.props.config.baseUrl}blog`}>Blog</Link>
            <ExternalLink href="https://stackoverflow.com/questions/tagged/react-testing-library">
              Stack Overflow
            </ExternalLink>
            <ExternalLink href="https://www.reactiflux.com/">
              Reactiflux on Discord
            </ExternalLink>
            <ExternalLink href="https://spectrum.chat/react-testing-library">
              Spectrum
            </ExternalLink>
          </div>
          <div>
            <h5>More</h5>
            <ExternalLink
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/kentcdodds/react-testing-library/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </ExternalLink>
            <ExternalLink href={`${this.props.config.repoUrl}`}>
              GitHub
            </ExternalLink>
            <ExternalLink href={`${this.props.config.docsRepoUrl}`}>
              Edit Docs on GitHub
            </ExternalLink>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    )
  }
}

module.exports = Footer

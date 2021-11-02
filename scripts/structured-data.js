const ejs = require('ejs');
const { stripHTML, escapeHTML } = require('hexo-util');

const organisationTemplateContent = `<script type="application/ld+json">
{ "@context": "http://schema.org",
  "@type": "Organization",
  "name": "profumo di frangipani",
  "url": "https://frangipani.raiano.ch",
  "logo": "https://frangipani.raiano.ch/css/images/logo_web.png",
  "sameAs": [""]
}
</script>`;
const websiteTemplateContent = `<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "name": "profumo di frangipani",
  "url": "https://frangipani.raiano.ch",
  "logo": "https://frangipani.raiano.ch/css/images/logo_web.png"
}
</script>`;

const articleTemplateContent = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "<%= pageUrl %>"
  },
  "headline": "<%= headline %>",
  "description": "<%= description %>",
  "image": "<%= imageUrl %>",  
  "author": {
    "@type": "Person",
    "name": "Erica Raiano",
    "url": "https://frangipani.raiano.ch/css/images/avatar.jpg"
  },  
  "publisher": {
    "@type": "Organization",
    "name": "profumo di frangipani",
    "logo": {
      "@type": "ImageObject",
      "url": "https://frangipani.raiano.ch/css/images/logo_web.png"
    }
  },
  "datePublished": "<%= datePublished %>",
  "dateModified": "<%= dateModified %>"
}
</script>`;

const getWebsiteStructuredData = (hexo) => {
  const data = {
    // 'name': config.title,
    // 'url': config.url
  };
  return getCompiledContent(websiteTemplateContent, data);
};

const getOrganizationStructuredData = (hexo) => {
  const data = {
    // 'name': config.seo_structured_data.organization.name,
    // 'url': config.seo_structured_data.organization.url,
    // 'logoUrl': config.seo_structured_data.organization.logoUrl
  };
  return getCompiledContent(organisationTemplateContent, data);
};

const getArticleStructuredData = (hexo) => {
  let description = hexo.page.description || hexo.page.excerpt || hexo.page.content;
  if (description) {
    // Remove prefixing/trailing spaces and replace new lines by spaces
    description = escapeHTML(stripHTML(description).substring(0, 200).trim()).replace(/\n/g, ' ');
  }

  const thumbnail = getThumbnailUrl(hexo.page);
  
  const data = {
    pageUrl: hexo.page.permalink,
    headline: hexo.page.title,
    description: description,
    imageUrl: thumbnail ? ('https://frangipani.raiano.ch/' + thumbnail) : 'https://frangipani.raiano.ch/css/images/logo_web.png',
    datePublished: hexo.page.date.toISOString(),
    dateModified: hexo.page.updated.toISOString()
  };
  return getCompiledContent(articleTemplateContent, data);
};

const getCompiledContent = (templateContent, data) => {
  var compiledTemplate = ejs.compile(templateContent);
  return compiledTemplate(data);
};

const getThumbnailUrl = (post) => {
  var url = post.thumbnail || '';
  if (!url) {
      var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/ig;
      var result = imgPattern.exec(post.content);
      if (result && result.length > 1) {
          url = result[1];
      }
      if(url.length > 0) {
          var pattern = /^[\\{0,1}\/{0,1}]([^\/^\\]+)/,
              pattern_ = /([^\/^\\]+)/;
          if ((ret = pattern.exec(url)) != null) {
              if(ret[0].length == url.length) {
                  url = post.path + ret[1];
              }
          } else if ((ret = pattern_.exec(url)) != null) {
              if(ret[0].length == url.length) {
                  url = post.path + ret[1];
              }
          }
          if(url.indexOf('../') === 0) {
            url = url.replace('../', '');
          }
      }
  }
  return url;
}

hexo.extend.helper.register('seoStructuredData', function () {
  const sections = [
    getOrganizationStructuredData(this),
    getWebsiteStructuredData(this)
  ];
  if (this.page.title) {
    sections.push(getArticleStructuredData(this));
  }
  return sections.join('\n');
});
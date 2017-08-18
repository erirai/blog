var lodash = require('lodash');

hexo.extend.generator.register('page', function pageGenerator(locals) {
  var pages = locals.pages.sort('-date').toArray();
  var length = pages.length;

  function getAlternatepages(label) {
    var alternates = pages.filter(function (page) {
      return page.label === label;
    });
    var result = [];
    lodash.each(alternates, function (page) {
      result.push({
        title: page.title,
        lang: page.lang,
        path: page.path
      });
    });
    return result;
  }

  return pages.map(function (page, i) {
    var layout = page.layout;
    var path = page.path;
    var j;
    var layouts = ['post', 'page', 'index'];

    if (!layout || layout === 'false') {
      return {
        path: path,
        data: page.content
      };
    }
    if (page.lang !== undefined) {
      for (j = i - 1; j >= 0 && page.prev === undefined; j--) {
        if (page.lang === pages[j].lang) {
          page.prev = pages[j];
        }
      }
      for (j = i + 1; j < length && page.next === undefined; j++) {
        if (page.lang === pages[j].lang) {
          page.next = pages[j];
        }
      }
    } else {
      // Default behavior
      if (i) page.prev = pages[i - 1];
      if (i < length - 1) page.next = pages[i + 1];
    }

    if (layout !== 'page') layouts.unshift(layout);

    if (page.label && page.lang) {
      page.alternates = getAlternatepages(page.label);
    }

    return {
      path: path,
      layout: layouts,
      data: lodash.extend({
        __page: true
      }, page)
    };
  });
});

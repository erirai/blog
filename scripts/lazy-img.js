hexo.extend.filter.register('after_render:html', function(data) {
  data = data.replace(/<img /g, '<img loading="lazy" ');
  return data;
});
  
hexo.extend.generator.register(function(locals) {
  var res = {
    path: "CNAME",
    data: this.config.url.replace(/^(http|https):\/\//, "")
  };

  if (this.config.additionalCNAMEs && this.config.additionalCNAMEs.length > 0) {
    res.data += '\n' + this.config.additionalCNAMEs.join('\n');
  }

  return res;
});

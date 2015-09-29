class HtmlCompiler extends CachingHtmlCompiler {
  constructor(name, appendHtml) {
    super(
      name,
      appendHtml,
      (additions) => additions
    );
  }
}

this.HtmlCompiler = HtmlCompiler;
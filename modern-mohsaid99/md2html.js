const marked = require("marked");
const hljs = require("highlight.js");

function md2html(md) {
  const html = marked.parse(md);

  const highlighted = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      const decoded = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&amp;/g, "&");

      const result = hljs.highlight(decoded, { language: lang }).value;

      return `<pre><code class="hljs language-${lang}">${result}</code></pre>`;
    }
  );

  return highlighted
    .replace(/<td>(\s*⛔\s*)<\/td>/g, `<td class="undone">$1</td>`)
    .replace(/<td>(\s*✅\s*)<\/td>/g, `<td class="done">$1</td>`);
}

module.exports = md2html;
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
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'");

      const result = hljs.highlight(decoded, { language: lang }).value;
      
      // Generate unique ID for this code block
      const uniqueId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return `<div class="code-box" data-language="${lang}">
        <div class="code-header">
          <button class="code-copy" onclick="
            const code = document.getElementById('${uniqueId}').innerText;
            navigator.clipboard.writeText(code);
            this.classList.add('copied');
            setTimeout(() => this.classList.remove('copied'), 2000);
          ">نسخ</button>
        </div>
        <div class="code-content">
          <pre><code id="${uniqueId}" class="hljs language-${lang}">${result}</code></pre>
        </div>
      </div>`;
    }
  );

  return highlighted
    .replace(/<td>(\s*⛔\s*)<\/td>/g, `<td class="undone">$1</td>`)
    .replace(/<td>(\s*✅\s*)<\/td>/g, `<td class="done">$1</td>`);
}

module.exports = md2html;

const marked = require("marked");

function md2html(md) {
  return marked
    .parse(md)
    .replace(/<td>(\s*⛔\s*)<\/td>/g, `<td class="undone">$1</td>`)
    .replace(/<td>(\s*✅\s*)<\/td>/g, `<td class="done">$1</td>`);
}

module.exports = md2html;

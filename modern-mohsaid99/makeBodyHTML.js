const { Pool } = require("pg");
const md2html = require("./md2html");

const pool = new Pool({
  connectionString:
    "postgresql://mohamed:moh01234@localhost:5432/mohsaid_posts",
});

async function makeBodyHTML() {
  // Fetch posts
  const posts = await pool.query(
    "SELECT * FROM posts WHERE type != 'goal' AND id > 675",
  );

  const markdownPosts = posts.rows;

  // console.log({ ids: markdownPosts.map((post) => post.id) });

  // Update body_html in DB
  for (const post of markdownPosts) {
    const html = md2html(post.body);

    await pool.query("UPDATE posts SET body_html = $1 WHERE id = $2", [
      html,
      post.id,
    ]);
  }

  return markdownPosts;
}

(async () => {
  await makeBodyHTML();
})();

# Modern MohSaid99 Back-end

### Posts

- Read:

```js
fetch("/api/posts?type=week&count=56");
```

---

- Create:

```js
fetch("/api/posts");
```

req.body:

```js
{
    title: string,
    body: string,
    type: string,
    storyid: number,
    special: boolean,
    secret: boolean,
    images: string[],
    dir: "rtl" | "ltr"
}
```

---

- Update:

```js
fetch("/api/posts/:id");
```

req.body:

```js
{
    title: string,
    body: string,
    type: string,
    storyid: number,
    special: boolean,
    secret: boolean,
    images: string[],
    dir: "rtl" | "ltr"
}
```

---

- Delete:

```js
fetch("/api/posts/:id");
```

---

### Stories

- Read:

```js
fetch("/api/stories?type=week&year=2026");
```

- Create:

```js
fetch("/api/stories")
```

req.body:

```js
const { title, summary, count, special, year } = req.body;
```


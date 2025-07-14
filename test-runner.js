// test-runner.js
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const http = require("http");
const { execSync } = require("child_process");

const BLOG_DIR = path.join(__dirname, "blogs");
const TEST_TITLE = "test-blog-post";
const BLOG_PATH = path.join(BLOG_DIR, `${TEST_TITLE}.md`);

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

function logSuccess(name) {
  console.log(`✅ ${name}`);
}

function logFail(name, err) {
  console.error(`❌ ${name}\n   → ${err.message}`);
}

//
// Add tests below
//

addTest("Create a new blog post", () => {
  execSync(`node blogforge.js create "${TEST_TITLE}"`);
  assert.ok(fs.existsSync(BLOG_PATH), "Blog file was not created");
});

addTest("List blog posts includes test blog", () => {
  const output = execSync(`node blogforge.js list`).toString();
  assert.ok(output.includes(TEST_TITLE), "Blog not found in list");
});

addTest("Delete test blog post", () => {
  execSync(`node blogforge.js delete "${TEST_TITLE}"`);
  assert.ok(!fs.existsSync(BLOG_PATH), "Blog file was not deleted");
});

addTest("Render blog HTML from markdown", () => {
  const markdown = "# Hello\n\nThis is a test.";
  const mdPath = path.join(BLOG_DIR, "render-test.md");
  fs.writeFileSync(mdPath, markdown);

  const render = require("./render");
  const html = render(mdPath);

  assert.ok(html.includes("<h1>Hello</h1>"), "Markdown not converted to HTML");
  fs.unlinkSync(mdPath);
});

// Optional: test server route (if server is running)
addTest("Check if server returns 200", (done) => {
  const req = http.get("http://localhost:3000", (res) => {
    assert.strictEqual(res.statusCode, 200);
    done();
  });

  req.on("error", (err) => done(err));
});

(async function runTests() {
  console.log(`\n🔎 Running ${tests.length} tests...\n`);

  for (const test of tests) {
    try {
      if (test.fn.length === 0) {
        // Synchronous
        test.fn();
        logSuccess(test.name);
      } else {
        // Async
        await new Promise((resolve, reject) => {
          test.fn((err) => (err ? reject(err) : resolve()));
        });
        logSuccess(test.name);
      }
    } catch (err) {
      logFail(test.name, err);
    }
  }

  console.log(`\n✅ Done`);
})();

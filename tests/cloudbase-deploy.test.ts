import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("uses standalone output for the CloudBase runtime image", () => {
  const nextConfig = readFileSync(join(projectRoot, "next.config.js"), "utf8");

  assert.match(nextConfig, /output:\s*"standalone"/);
});

test("provides a standalone Docker image for CloudBase Cloud Run", () => {
  const dockerfilePath = join(projectRoot, "Dockerfile");

  assert.equal(existsSync(dockerfilePath), true, "Dockerfile must exist");

  const dockerfile = readFileSync(dockerfilePath, "utf8");

  assert.match(dockerfile, /node:20-alpine/);
  assert.match(dockerfile, /npm ci/);
  assert.match(dockerfile, /COPY --from=builder .*\.next\/standalone/);
  assert.match(dockerfile, /COPY --from=builder .*\.next\/static/);
  assert.match(dockerfile, /ENV PORT=3000/);
  assert.match(dockerfile, /ENV HOSTNAME=0\.0\.0\.0/);
  assert.match(dockerfile, /CMD \["node", "server\.js"\]/);
});

test("excludes local build output and editor artifacts from Docker uploads", () => {
  const dockerignorePath = join(projectRoot, ".dockerignore");

  assert.equal(existsSync(dockerignorePath), true, ".dockerignore must exist");

  const dockerignore = readFileSync(dockerignorePath, "utf8");

  for (const ignoredPath of [
    "node_modules",
    ".next",
    ".git",
    ".trae",
    ".presentation-previews",
    "deliverables",
  ]) {
    assert.match(dockerignore, new RegExp(`^${ignoredPath.replace(".", "\\.")}$`, "m"));
  }
});

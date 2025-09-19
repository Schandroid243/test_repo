const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_DIR = path.join(__dirname, "test_repo");
const totalDays = 365;
const commitsPerDay = 5;

function runCommand(cmd, cwd = REPO_DIR) {
  execSync(cmd, { cwd, stdio: "inherit" });
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

if (fs.existsSync(REPO_DIR)) {
  fs.rmdirSync(REPO_DIR, { recursive: true });
}
fs.mkdirSync(REPO_DIR);
process.chdir(REPO_DIR);
runCommand("git init");
fs.writeFileSync("README.md", "# Test Repo\n");
runCommand("git add README.md");
runCommand('git commit -m "Initial commit"');

const now = new Date();
for (let i = totalDays; i >= 0; i--) {
  const date = new Date(now);
  date.setDate(now.getDate() - i);
  const formattedDate = formatDate(date);
  for (let j = 0; j < commitsPerDay; j++) {
    fs.appendFileSync("README.md", `Commit on ${formattedDate} - ${j + 1}\n`);
    runCommand("git add README.md");
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: `${formattedDate}T12:00:00`,
      GIT_COMMITTER_DATE: `${formattedDate}T12:00:00`,
    };
    execSync(`git commit -m "Commit on ${formattedDate} - ${j + 1}"`, {
      cwd: REPO_DIR,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
  }
}

console.log("Done generating commits !");

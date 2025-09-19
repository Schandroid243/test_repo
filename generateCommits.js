const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Chemin vers le dossier du repo cloné
const REPO_DIR = "/Users/schadrack/Documents/Projects/focus/test_repo";
const totalDays = 365;
const commitsPerDay = 5;

function runCommand(cmd, cwd = REPO_DIR) {
  execSync(cmd, { cwd, stdio: "inherit" });
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Se placer dans le dossier du repo existant
process.chdir(REPO_DIR);

const now = new Date();
for (let i = totalDays; i >= 0; i--) {
  const date = new Date(now);
  date.setDate(now.getDate() - i);
  const formattedDate = formatDate(date);
  for (let j = 0; j < commitsPerDay; j++) {
    fs.writeFileSync("log.txt", `Commit for ${formattedDate} - ${j + 1}\n`, {
      flag: "a",
    });
    runCommand("git add log.txt");
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: `${formattedDate}T12:00:00`,
      GIT_COMMITTER_DATE: `${formattedDate}T12:00:00`,
    };
    execSync(`git commit -m "Commit on ${formattedDate} - ${j + 1}"`, {
      cwd: REPO_DIR,
      env,
      stdio: "inherit",
    });
  }
}

console.log("Done generating commits !");

import { faker } from "@faker-js/faker";

import db from "../src/index.js";
import { STATUS } from "../src/generated/db.js";

const STATUS_VALUE: readonly STATUS[] = [
  "SKIPPED",
  "IN_PROGRESS",
  "FAILED",
  "SUCCEEDED",
  "CANCELLED",
];

function getRandomStatus() {
  return STATUS_VALUE[Math.floor(Math.random() * STATUS_VALUE.length)];
}

const items = Array.from({ length: 10 }, () => {
  const workflow = {
    head_commit: faker.git.commitSha(),
    repository_full_name: "EvergreenDocs/EvergreenDocs",
    head_commit_message: faker.git.commitMessage(),
    status: getRandomStatus(),
  } as const;

  const tasks = Array.from({ length: 5 }, () => {
    return {
      head_commit: workflow.head_commit,
      preset: faker.random.word(),
      status: getRandomStatus(),
    } as const;
  });
  return { workflow, tasks };
});

for (const item of items) {
  await db.insertInto("Workflows").values(item.workflow).execute();
  await db.insertInto("Tasks").values(item.tasks).execute();
}

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

const items = Array.from({ length: 50 }, () => {
  // TODO: don't use any here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workflow: any = {
    head_commit: faker.git.commitSha(),
    repository_full_name: "EvergreenDocs/EvergreenDocs",
    head_commit_message: faker.git.commitMessage(),
    status: getRandomStatus(),
    started_at: faker.date.between(new Date("2021-01-01"), new Date()),
  };

  if (workflow.status !== "IN_PROGRESS") {
    workflow.completed_at = faker.date.between(workflow.started_at, new Date());
  }

  if (workflow.status === "FAILED") {
    workflow.reason = faker.random.word();
  }

  const tasks = Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => {
    // TODO: don't use any here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const task: any = {
      head_commit: workflow.head_commit,
      preset: faker.random.word(),
      status: workflow.status === "SKIPPED" ? "SKIPPED" : getRandomStatus(),
      started_at: faker.date.between(workflow.started_at, workflow.completed_at || new Date()),
    } as const;

    if (task.status !== "IN_PROGRESS") {
      task.completed_at = faker.date.between(task.started_at, workflow.completed_at || new Date());
    }

    if (task.status === "FAILED") {
      task.reason = faker.random.word();
    }

    if (task.status === "SUCCEEDED") {
      task.output_pull_request_url = `https://www.github.com/${
        workflow.repository_full_name
      }/pull/${faker.datatype.number({ min: 1, max: 1000 })}`;
      task.output_commit = faker.git.commitSha();
      task.output_commit_message = faker.git.commitMessage();
    }

    return task;
  });
  return { workflow, tasks };
});

await Promise.all(
  items.map(async (item) => {
    await db.insertInto("Workflows").values(item.workflow).execute();
    await db.insertInto("Tasks").values(item.tasks).execute();
  })
);

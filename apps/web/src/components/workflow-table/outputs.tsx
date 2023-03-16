import { IconGitPullRequest, IconExclamationCircle } from "@tabler/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

import RenderIf from "../render-if";

import { ColumnBodyProps } from "./types";

function OutputsTableDataHead() {
  return <>Outputs</>;
}

function OutputsTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    const numberOfPullRequests = props.workflow.tasks.reduce(
      (acc, task) => (task.outputPullRequestUrl ? acc + 1 : acc),
      0
    );
    const numberOfErrors = props.workflow.tasks.reduce(
      (acc, task) => (task.reason && task.status !== "skipped" ? acc + 1 : acc),
      0
    );

    return (
      <div className="flex flex-row items-center gap-3">
        <RenderIf condition={numberOfPullRequests > 0}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div>
                  <IconGitPullRequest className="text-purple-700" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={4}
                  className={"inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5"}
                >
                  <Tooltip.Arrow className="fill-current text-gray-900" />
                  <span className="block text-xs leading-none text-gray-100">
                    {numberOfPullRequests} pull request
                    {numberOfPullRequests > 1 ? "s" : ""}
                  </span>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </RenderIf>

        <RenderIf condition={numberOfErrors > 0}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div>
                  <IconExclamationCircle className="text-red-500" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={4}
                  className={"inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5"}
                >
                  <Tooltip.Arrow className="fill-current text-gray-900" />
                  <span className="block text-xs leading-none text-gray-100">
                    {numberOfErrors} error
                    {numberOfErrors > 1 ? "s" : ""}
                  </span>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </RenderIf>
      </div>
    );
  }

  if ("task" in props) {
    return (
      <div className="flex flex-row items-center gap-3">
        <RenderIf condition={Boolean(props.task.reason && props.task.status !== "skipped")}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div>
                  <IconExclamationCircle className="text-red-500" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={4}
                  className={"inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5"}
                >
                  <Tooltip.Arrow className="fill-current text-gray-900" />
                  <span className="block text-xs leading-none text-gray-100">
                    {props.task.reason}
                  </span>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </RenderIf>

        <RenderIf condition={Boolean(props.task.outputPullRequestUrl)}>
          <a
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-full bg-purple-700 px-1 py-2 text-xs text-white hover:bg-purple-800"
          >
            <IconGitPullRequest size={15} />
            <a href={props.task.outputPullRequestUrl} target="_blank" rel="noreferrer">
              #{props.task.outputPullRequestUrl?.split("/").pop()}
            </a>
          </a>
        </RenderIf>
      </div>
    );
  }

  return <></>;
}

const OutputsColumn = {
  Head: OutputsTableDataHead,
  Body: OutputsTableDataBody,
};

export default OutputsColumn;

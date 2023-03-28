import { IconGitPullRequest, IconExclamationCircle } from "@tabler/icons";
import React from "react";

import { RenderIf, Tooltip } from "../common";

import { ColumnBodyProps, ColumnHeadProps } from "./types";

function OutputsTableDataHead({}: ColumnHeadProps) {
  return <>Outputs</>;
}

function OutputsTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    const numberOfPullRequests = props.workflow.tasks.reduce(
      (acc, task) => (task.output_pull_request_url ? acc + 1 : acc),
      0
    );
    const numberOfErrors = props.workflow.tasks.reduce(
      (acc, task) => (task.reason && task.status !== "SKIPPED" ? acc + 1 : acc),
      0
    );

    return (
      <div className="flex flex-row items-center gap-3">
        <RenderIf condition={numberOfPullRequests > 0}>
          <Tooltip
            mainComponent={
              <div>
                <IconGitPullRequest className="text-purple-700" />
              </div>
            }
            tooltipComponent={
              <span className="block text-xs leading-none text-gray-100">
                {numberOfPullRequests} pull request
                {numberOfPullRequests > 1 ? "s" : ""}
              </span>
            }
          />
        </RenderIf>

        <RenderIf condition={numberOfErrors > 0}>
          <Tooltip
            mainComponent={
              <div>
                <IconExclamationCircle className="text-red-500" />
              </div>
            }
            tooltipComponent={
              <span className="block text-xs leading-none text-gray-100">
                {numberOfErrors} error
                {numberOfErrors > 1 ? "s" : ""}
              </span>
            }
          />
        </RenderIf>
      </div>
    );
  }

  if ("task" in props) {
    return (
      <div className="flex flex-row items-center gap-3">
        <RenderIf condition={Boolean(props.task.reason && props.task.status !== "SKIPPED")}>
          <Tooltip
            mainComponent={
              <div>
                <IconExclamationCircle className="text-red-500" />
              </div>
            }
            tooltipComponent={
              <span className="block text-xs leading-none text-gray-100">{props.task.reason}</span>
            }
          />
        </RenderIf>

        <RenderIf condition={Boolean(props.task.output_pull_request_url)}>
          <a
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-full bg-purple-700 px-1 py-2 text-xs text-white hover:bg-purple-800"
          >
            <IconGitPullRequest size={15} />
            <a href={props.task.output_pull_request_url || ""} target="_blank" rel="noreferrer">
              #{props.task.output_pull_request_url?.split("/").pop()}
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

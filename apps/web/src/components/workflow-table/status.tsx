import { IconCalendarStats, IconClockHour3 } from "@tabler/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { RouterOutput } from "../../trpc";

import { ColumnBodyProps } from "./types";

dayjs.extend(relativeTime);

const statusClassMap: Record<
  RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]["status"],
  string
> = {
  success: "bg-green-500 border-green-500",
  failed: "bg-red-500 border-red-500",
  cancelled: "border-2 border-gray-500",
  in_progress: "bg-yellow-500 border-blue-500",
  skipped: "border-2 border-gray-500",
};

const statusTextMap: Record<
  RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]["status"],
  string
> = {
  success: "Success",
  failed: "Failed",
  cancelled: "Cancelled",
  in_progress: "In Progress",
  skipped: "Skipped",
};

function StatusTableDataHead() {
  return <>Status</>;
}

function StatusTableDataBody(props: ColumnBodyProps) {
  const status = "workflow" in props ? props.workflow?.status : props.task?.status;
  const startedAt = "workflow" in props ? props.workflow?.startedAt : props.task?.startedAt;
  const completedAt = "workflow" in props ? props.workflow?.completedAt : props.task?.completedAt;

  return (
    <div className="flex flex-row items-center gap-3">
      {/* TODO: Extract tooltip into component */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={`h-3 w-3 rounded-full ${statusClassMap[status]}`}></div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={4}
              className={"inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5"}
            >
              <Tooltip.Arrow className="fill-current text-gray-900" />
              <span className="block text-xs leading-none text-gray-100">
                {statusTextMap[status]}
              </span>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <div className="flex flex-col">
        <p className="inline-flex items-center gap-1">
          <IconCalendarStats size={15} />
          {dayjs().to(startedAt)}
        </p>
        <p className="inline-flex items-center gap-1">
          <IconClockHour3 size={15} />
          {dayjs(completedAt).to(startedAt, true)}
        </p>
      </div>
    </div>
  );
}

const StatusColumn = {
  Head: StatusTableDataHead,
  Body: StatusTableDataBody,
};

export default StatusColumn;

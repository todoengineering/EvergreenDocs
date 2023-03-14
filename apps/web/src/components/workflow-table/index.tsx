import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import { RouterOutput, trpc } from "../../trpc";
import RenderIf from "../render-if";

import ActionsTable from "./actions";
import StatusTable from "./status";
import CommitTable from "./commit";
import ProjectTable from "./project";
import { Column } from "./types";

const columns: readonly Column[] = [ProjectTable, CommitTable, StatusTable, ActionsTable];

function WorkflowTableBodyRow(props: {
  workflow: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root className="CollapsibleRoot" open={open} onOpenChange={setOpen} asChild>
      <>
        <Collapsible.Trigger asChild className="border-b bg-white text-black ">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <tr type="" className="cursor-pointer hover:bg-emerald-50">
            {columns.map((column) => (
              <td className="px-6 py-4" key={props.workflow.headCommit}>
                <column.Body workflow={props.workflow} />
              </td>
            ))}
          </tr>
        </Collapsible.Trigger>

        <>
          {props.workflow.tasks.map((task) => (
            <Collapsible.Content asChild key={task.headCommit}>
              <tr className="bg-cyan-50">
                {columns.map((column) => (
                  <td className="px-6 py-2" key={task.headCommit}>
                    <column.Body task={task} />
                  </td>
                ))}
              </tr>
            </Collapsible.Content>
          ))}
        </>
      </>
    </Collapsible.Root>
  );
}

function WorkflowTable() {
  const { data: workflowLogs, isLoading } = trpc.workflowLog.getLoggedInUserWorkflowLogs.useQuery(
    {}
  );

  return (
    <table className="border-collapse overflow-hidden rounded text-left text-sm shadow-md">
      <thead className=" bg-gray-200 text-xs uppercase text-black">
        <tr>
          {columns.map((column, index) => (
            <th scope="col" className="px-6 py-3" key={index}>
              <column.Head />
            </th>
          ))}
        </tr>
      </thead>

      <RenderIf condition={!isLoading}>
        <tbody>
          {workflowLogs?.items.map((workflow) => (
            <WorkflowTableBodyRow workflow={workflow} key={workflow.headCommit} />
          ))}
        </tbody>
      </RenderIf>

      <RenderIf condition={isLoading}>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b bg-white text-black">
              {columns.map((column, colIndex) => (
                <td className="px-6 py-4" key={colIndex}>
                  <div
                    className={`${
                      colIndex % 2 === 0 ? "bg-gray-300" : "bg-gray-400"
                    } mt-3 mb-6 h-4 animate-pulse rounded`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </RenderIf>
    </table>
  );
}

export default WorkflowTable;

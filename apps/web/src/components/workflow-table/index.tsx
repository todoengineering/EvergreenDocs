import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useRouter } from "next/router";

import { RouterOutput, trpc } from "../../trpc";
import { RenderIf } from "../common";
import Button from "../common/button";

import OutputsColumn from "./outputs";
import StatusColumn from "./status";
import CommitColumn from "./commit";
import ProjectColumn from "./project";
import { Column } from "./types";

const columns: readonly Column[] = [ProjectColumn, CommitColumn, StatusColumn, OutputsColumn];

function WorkflowTableBodyRow(props: {
  workflow: RouterOutput["workflowLog"]["getWorkflowsByRepository"]["items"][number];
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
              <td className="px-6 py-4" key={`${props.workflow.headCommit}-${column.Head.name}`}>
                <column.Body workflow={props.workflow} />
              </td>
            ))}
          </tr>
        </Collapsible.Trigger>

        <>
          {props.workflow.tasks.map((task) => (
            <Collapsible.Content asChild key={`${task.head_commit}-${task.id}`}>
              <tr className="border-b bg-gray-50">
                {columns.map((column) => (
                  <td className="px-6 py-2" key={`${task.head_commit}-${column.Head.name}`}>
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
  const router = useRouter();
  const { organisation, name } = router.query;
  const repositoryFullName = `${organisation}/${name}`;

  // TODO: Maybe use zod for this? Also maybe store this in url?
  const [filters, setFilters] = useState<{
    includeSkippedWorkflows: boolean;
    page: number;
  }>({ includeSkippedWorkflows: true, page: 1 });

  const { data: userRepositories } = trpc.user.getRepositories.useQuery();
  const { data: workflowLogs, isLoading } = trpc.workflowLog.getWorkflowsByRepository.useQuery(
    {
      repositoryFullName: repositoryFullName,
      includeSkippedWorkflows: filters.includeSkippedWorkflows,
      limit: 25,
      page: filters.page,
    },
    { refetchInterval: 1000 * 60 }
  );

  return (
    <div className="flex flex-row">
      <div className="sticky top-0 h-screen overflow-auto rounded-r border bg-white shadow-md">
        <p className="flex h-12 items-center px-3 text-xs font-bold uppercase">Repositories</p>

        <ul className="mt-2 flex flex-col gap-2">
          {userRepositories?.map((repo) => {
            return (
              <Button
                variant="text"
                key={repo.full_name}
                href={`/app/repository/${repo.full_name}`}
                className="mx-1 rounded-md p-2 text-xs hover:bg-gray-100 "
              >
                {repo.full_name}
              </Button>
            );
          })}
        </ul>
      </div>

      <div className="my-5 ml-2 mr-24 flex-1">
        <table className="mr-48 w-full flex-1 border-collapse overflow-hidden rounded text-left text-sm shadow-md">
          <thead className=" h-12 bg-gray-200 text-xs uppercase text-black">
            <tr>
              {columns.map((column, index) => (
                <th scope="col" className="px-6 py-3" key={index}>
                  <column.Head
                    workflows={workflowLogs?.items}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <RenderIf condition={!isLoading} as="tbody">
            {workflowLogs?.items?.map((workflow) => (
              <WorkflowTableBodyRow
                workflow={workflow}
                key={`${workflow.headCommit}-WorkflowTableBodyRow`}
              />
            ))}
          </RenderIf>

          <RenderIf condition={isLoading}>
            <tbody>
              {Array.from({ length: 25 }).map((_, index) => (
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

        <div className="mt-3 flex w-full justify-end gap-3">
          <Button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>

          <Button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={workflowLogs?.hasMore === false}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkflowTable;

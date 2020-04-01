import React from 'react';
import {
  StaticResult,
  StaticTask,
  TaskGroup,
  TaskGroupResult,
  TimedResult,
  TimedTask,
} from '../types';
import { asyncMap } from './async';
import runStaticTask from './run-static-task';
import runTimedTaskRepeatedly from './run-timed-task-repeatedly';

function toMap<T extends { taskId: string }>(list: T[]): Record<string, T> {
  return list.reduce((acc: Record<string, T>, item: T) => {
    acc[item.taskId] = item;
    return acc;
  }, {});
}

type RunGroupArgs = {
  group: TaskGroup;
  getElement: () => React.ReactElement;
  samples: number;
};

export default async function runGroup({
  group,
  getElement,
  samples,
}: RunGroupArgs): Promise<TaskGroupResult> {
  const timedResults: TimedResult[] = await asyncMap({
    source: group.timed,
    map: async function map(task: TimedTask): Promise<TimedResult> {
      return await runTimedTaskRepeatedly({
        task,
        getElement,
        samples,
      });
    },
  });

  const staticResults: StaticResult[] = await asyncMap({
    source: group.static,
    map: async function map(task: StaticTask): Promise<StaticResult> {
      const value: string = await runStaticTask({
        task,
        getElement,
      });
      const result: StaticResult = {
        taskId: task.taskId,
        value,
      };
      return result;
    },
  });

  const results: TaskGroupResult = {
    groupId: group.groupId,
    timed: toMap(timedResults),
    static: toMap(staticResults),
  };

  return results;
}
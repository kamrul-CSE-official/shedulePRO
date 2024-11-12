"use client";

import React, { useState } from "react";
import Timeline, {
  TimelineHeaders,
  DateHeader,
  TimelineMarkers,
  TodayMarker,
  TimelineGroupBase,
  TimelineItemBase,
  ItemRenderer,
} from "react-calendar-timeline";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, Trash2Icon, Edit2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Group extends TimelineGroupBase {
  title: string;
}

interface Item extends TimelineItemBase {
  title: string;
  progress: number;
  style?: React.CSSProperties;
}

export default function EnhancedIndustrialGanttChart() {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, title: "Machine A" },
    { id: 2, title: "Machine B" },
    { id: 3, title: "Machine C" },
  ]);

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      group: 1,
      title: "Task 1",
      start_time: moment().valueOf(),
      end_time: moment().add(2, "days").valueOf(),
      canMove: true,
      canResize: "both",
      canChangeGroup: true,
      progress: 55,
      style: { backgroundColor: "rgb(258, 64, 406)" },
    },
    {
      id: 2,
      group: 2,
      title: "Task 2",
      start_time: moment().add(3, "days").valueOf(),
      end_time: moment().add(5, "days").valueOf(),
      canMove: true,
      canResize: "both",
      canChangeGroup: true,
      progress: 0,
      style: { backgroundColor: "rgb(106, 204, 106)" },
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStartDate, setNewTaskStartDate] = useState<Date | undefined>(
    new Date()
  );
  const [newTaskEndDate, setNewTaskEndDate] = useState<Date | undefined>(
    new Date()
  );
  const [newTaskStartTime, setNewTaskStartTime] = useState("00:00");
  const [newTaskEndTime, setNewTaskEndTime] = useState("00:00");
  const [newTaskGroup, setNewTaskGroup] = useState("1");
  const [newTaskProgress, setNewTaskProgress] = useState(0);

  const [editingTask, setEditingTask] = useState<Item | null>(null);

  const handleItemMove = (
    itemId: number,
    dragTime: number,
    newGroupOrder: number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const deltaTime = dragTime - item.start_time;
          return {
            ...item,
            start_time: dragTime,
            end_time: item.end_time + deltaTime,
            group: groups[newGroupOrder].id,
          };
        }
        return item;
      })
    );
  };

  const handleItemResize = (
    itemId: number,
    time: number,
    edge: "left" | "right"
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            start_time: edge === "left" ? time : item.start_time,
            end_time: edge === "right" ? time : item.end_time,
          };
        }
        return item;
      })
    );
  };

  const addNewTask = () => {
    if (newTaskTitle && newTaskStartDate && newTaskEndDate) {
      const startDateTime = moment(newTaskStartDate)
        .hours(parseInt(newTaskStartTime.split(":")[0]))
        .minutes(parseInt(newTaskStartTime.split(":")[1]));
      const endDateTime = moment(newTaskEndDate)
        .hours(parseInt(newTaskEndTime.split(":")[0]))
        .minutes(parseInt(newTaskEndTime.split(":")[1]));

      const newItem: Item = {
        id: items.length + 1,
        group: parseInt(newTaskGroup),
        title: newTaskTitle,
        start_time: startDateTime.valueOf(),
        end_time: endDateTime.valueOf(),
        canMove: true,
        canResize: "both",
        canChangeGroup: true,
        progress: newTaskProgress,
        style: { backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` },
      };
      setItems([...items, newItem]);
      resetNewTaskForm();
    }
  };

  const updateTask = () => {
    if (editingTask) {
      setItems(
        items.map((item) => (item.id === editingTask.id ? editingTask : item))
      );
      setEditingTask(null);
    }
  };

  const deleteTask = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const resetNewTaskForm = () => {
    setNewTaskTitle("");
    setNewTaskStartDate(new Date());
    setNewTaskEndDate(new Date());
    setNewTaskStartTime("00:00");
    setNewTaskEndTime("00:00");
    setNewTaskGroup("1");
    setNewTaskProgress(0);
  };

  const itemRenderer: ItemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected
      ? item.selectedBgColor || "#ffc107"
      : item.bgColor || "#3db9d3";
    const progressStyle: React.CSSProperties = {
      position: "absolute",
      top: "0",
      left: "0",
      width: `${item.progress}%`,
      height: "100%",
      backgroundColor: "rgba(0, 255, 0, 0.3)",
    };

    return (
      <div
        {...getItemProps({
          style: {
            ...item.style,
            backgroundColor,
            color: item.color,
            borderRadius: "4px",
            boxShadow: "0 1px 5px rgba(0,0,0,0.15)",
          },
        })}
      >
        <div style={progressStyle} />
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
        <div
          className="flex items-center justify-between h-full px-2 text-sm font-medium"
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span>{itemContext.title}</span>
          <span className="text-xs">{item.progress}%</span>
        </div>
        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
        <div className="absolute top-0 right-0 flex space-x-1 p-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setEditingTask(item)}
              >
                <Edit2Icon className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                task={editingTask}
                setTask={setEditingTask}
                onSubmit={updateTask}
                groups={groups}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => deleteTask(item.id)}
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced Industrial Machine Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <TaskForm
            task={{
              title: newTaskTitle,
              start_time: newTaskStartDate?.valueOf() || 0,
              end_time: newTaskEndDate?.valueOf() || 0,
              group: parseInt(newTaskGroup),
              progress: newTaskProgress,
            }}
            setTask={(task) => {
              setNewTaskTitle(task.title);
              setNewTaskStartDate(new Date(task.start_time));
              setNewTaskEndDate(new Date(task.end_time));
              setNewTaskGroup(task.group.toString());
              setNewTaskProgress(task.progress);
            }}
            onSubmit={addNewTask}
            groups={groups}
          />
          <Button onClick={addNewTask} className="w-full">
            Add Task
          </Button>
        </div>
        <div className="h-[600px]">
          <Timeline
            groups={groups}
            items={items}
            defaultTimeStart={moment().add(-12, "hour")}
            defaultTimeEnd={moment().add(1, "week")}
            itemRenderer={itemRenderer}
            onItemMove={handleItemMove}
            onItemResize={handleItemResize}
            stackItems
            sidebarWidth={150}
            lineHeight={60}
            itemHeightRatio={0.75}
          >
            <TimelineHeaders className="bg-background text-foreground">
              <DateHeader unit="day" />
              <DateHeader unit="hour" labelFormat="HH:mm" />
            </TimelineHeaders>
            <TimelineMarkers>
              <TodayMarker />
            </TimelineMarkers>
          </Timeline>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskFormProps {
  task: Partial<Item>;
  setTask: (task: Partial<Item>) => void;
  onSubmit: () => void;
  groups: Group[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  setTask,
  onSubmit,
  groups,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <InputField
        label="Task Title"
        value={task.title || ""}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        placeholder="Enter task title"
      />
      <Select
        value={task.group?.toString()}
        onValueChange={(value) => setTask({ ...task, group: parseInt(value) })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select machine" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DateTimePicker
        label="Start Date & Time"
        date={task.start_time ? new Date(task.start_time) : undefined}
        setDate={(date) => setTask({ ...task, start_time: date?.valueOf() })}
      />
      <DateTimePicker
        label="End Date & Time"
        date={task.end_time ? new Date(task.end_time) : undefined}
        setDate={(date) => setTask({ ...task, end_time: date?.valueOf() })}
      />
      <div className="sm:col-span-2">
        <Label>Progress</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[task.progress || 0]}
            onValueChange={([value]) => setTask({ ...task, progress: value })}
            max={100}
            step={1}
          />
          <span>{task.progress || 0}%</span>
        </div>
      </div>
      <Button onClick={onSubmit} className="sm:col-span-2">
        {task?.id ? "Update Task" : "Add Task"}
      </Button>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="grid w-full items-center gap-1.5">
    <Label htmlFor={label}>{label}</Label>
    <Input
      type={type}
      id={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const DateTimePicker: React.FC<{
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}> = ({ label, date, setDate }) => {
  const [time, setTime] = useState(date ? format(date, "HH:mm") : "00:00");

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = time.split(":").map(Number);
      newDate.setHours(hours, minutes);
    }
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (date) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      setDate(newDate);
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label>{label}</Label>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              //   initialFocus={true}
            />
          </PopoverContent>
        </Popover>
        <Input type="time" value={time} onChange={handleTimeChange} />
      </div>
    </div>
  );
};

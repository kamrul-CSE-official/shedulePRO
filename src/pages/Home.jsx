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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function IndustrialGanttChart() {
  const [groups, setGroups] = useState([
    { id: 1, title: "Machine A" },
    { id: 2, title: "Machine B" },
    { id: 3, title: "Machine C" },
  ]);

  const [items, setItems] = useState([
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
      style: { backgroundColor: "rgb(158, 14, 206)" },
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
  const [newTaskStartDate, setNewTaskStartDate] = useState(new Date());
  const [newTaskEndDate, setNewTaskEndDate] = useState(new Date());
  const [newTaskStartTime, setNewTaskStartTime] = useState("00:00");
  const [newTaskEndTime, setNewTaskEndTime] = useState("00:00");

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const updatedItems = items.map((item) => {
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
    });
    setItems(updatedItems);
  };

  const handleItemResize = (itemId, time, edge) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          start_time: edge === "left" ? time : item.start_time,
          end_time: edge === "right" ? time : item.end_time,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const addNewTask = () => {
    if (newTaskTitle && newTaskStartDate && newTaskEndDate) {
      const startDateTime = moment(newTaskStartDate)
        .hours(parseInt(newTaskStartTime.split(":")[0]))
        .minutes(parseInt(newTaskStartTime.split(":")[1]));
      const endDateTime = moment(newTaskEndDate)
        .hours(parseInt(newTaskEndTime.split(":")[0]))
        .minutes(parseInt(newTaskEndTime.split(":")[1]));

      const newItem = {
        id: items.length + 1,
        group: 1,
        title: newTaskTitle,
        start_time: startDateTime.valueOf(),
        end_time: endDateTime.valueOf(),
        canMove: true,
        canResize: "both",
        canChangeGroup: true,
        progress: 0,
        style: {
          backgroundColor: `rgb(${Math.random() * 255}, ${
            Math.random() * 255
          }, ${Math.random() * 255})`,
        },
      };
      setItems([...items, newItem]);
      setNewTaskTitle("");
      setNewTaskStartDate(new Date());
      setNewTaskEndDate(new Date());
      setNewTaskStartTime("00:00");
      setNewTaskEndTime("00:00");
    }
  };

  const itemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const progressStyle = {
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
            backgroundColor: itemContext.selected ? "#ffc107" : "#3db9d3",
          },
        })}
      >
        <div style={progressStyle} />
        {itemContext.useResizeHandle && <div {...leftResizeProps} />}
        <div className="h-full overflow-hidden px-2 text-ellipsis whitespace-nowrap">
          {itemContext.title} - {item.progress}%
        </div>
        {itemContext.useResizeHandle && <div {...rightResizeProps} />}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Industrial Machine Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <InputField
            label="New Task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter new task title"
          />
          <DatePicker
            label="Start Date"
            date={newTaskStartDate}
            setDate={setNewTaskStartDate}
          />
          <InputField
            label="Start Time"
            type="time"
            value={newTaskStartTime}
            onChange={(e) => setNewTaskStartTime(e.target.value)}
          />
          <DatePicker
            label="End Date"
            date={newTaskEndDate}
            setDate={setNewTaskEndDate}
          />
          <InputField
            label="End Time"
            type="time"
            value={newTaskEndTime}
            onChange={(e) => setNewTaskEndTime(e.target.value)}
          />
        </div>
        <Button onClick={addNewTask} className="mb-4">
          Add Task
        </Button>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(1, "week")}
          itemRenderer={itemRenderer}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          stackItems
          sidebarWidth={0.75}
          itemHeightRatio={0.75}
          lineHeight={40}
        >
          <TimelineHeaders>
            <DateHeader unit="day" />
            <DateHeader unit="hour" />
          </TimelineHeaders>
          <TimelineMarkers>
            <TodayMarker />
          </TimelineMarkers>
        </Timeline>
      </CardContent>
    </Card>
  );
}

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="grid w-full items-center gap-1.5">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const DatePicker = ({ label, date, setDate }) => (
  <div className="grid w-full items-center gap-1.5">
    <Label>{label}</Label>
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
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
);

import { IoAppsSharp } from "react-icons/io5";
import { MdOutlineAccessTime } from "react-icons/md";
import { LuWorkflow } from "react-icons/lu";
import React from "react";

export const sideBars: {
  id: number;
  icon: React.ReactNode;
  label: string;
  link: string;
}[] = [
  { id: 1, icon: <LuWorkflow />, label: "Flows", link: "/flows" },
  { id: 2, icon: <IoAppsSharp />, label: "My Apps", link: "/apps" },
  {
    id: 3,
    icon: <MdOutlineAccessTime />,
    label: "Executions",
    link: "/executions",
  },
];

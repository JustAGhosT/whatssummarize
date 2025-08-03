"use client"

import { createPage } from "@utils/page-utils"

export default createPage(async () => {
  const mod = await import("@ui/features/groups");
  return mod.Groups;
})

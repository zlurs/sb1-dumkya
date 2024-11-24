import * as React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Drawer = Dialog
const DrawerTrigger = DialogTrigger
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent> & {
    side?: "top" | "right" | "bottom" | "left"
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "fixed z-50 flex flex-col bg-background shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
      {
        "inset-y-0 right-0 h-full border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0": side === "right",
        "inset-y-0 left-0 h-full border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0": side === "left",
        "inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0": side === "top",
        "inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0": side === "bottom",
      },
      className
    )}
    {...props}
  >
    {children}
  </DialogContent>
))
DrawerContent.displayName = "DrawerContent"

export { Drawer, DrawerTrigger, DrawerContent }
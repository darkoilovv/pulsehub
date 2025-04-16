import { Boxes, CreditCard, LayoutDashboard, Settings, Share2 } from "lucide-react"

export const getRoutes = (pathname: string) => [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    active: pathname === "/dashboard",
  },
  {
    label: "Instances",
    icon: Boxes,
    href: "/instances",
    active: pathname === "/instances",
  },
  {
    label: "Integrations",
    icon: Share2,
    href: "/integrations",
    active: pathname === "/integrations",
  },
  {
    label: "Payments/Subscriptions",
    icon: CreditCard,
    href: "/payments",
    active: pathname === "/payments",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    active: pathname === "/settings",
  },
]

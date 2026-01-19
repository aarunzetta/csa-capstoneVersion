import type { Component } from "vue";
import {
  LayoutDashboard,
  CarTaxiFront,
  UserStar,
  MessageCircle,
  Users,
  IdCard,
  QrCode,
  MapPin,
} from "lucide-vue-next";

export interface NavItem {
  label: string;
  path: string;
  icon: Component;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Tables",
    items: [
      {
        label: "Rides",
        path: "/rides",
        icon: CarTaxiFront,
      },
      {
        label: "Drivers",
        path: "/drivers",
        icon: IdCard,
      },
      {
        label: "Passengers",
        path: "/passengers",
        icon: Users,
      },
      {
        label: "Feedbacks",
        path: "/feedbacks",
        icon: MessageCircle,
      },
      {
        label: "Admins",
        path: "/admins",
        icon: UserStar,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "QR Code Generator",
        path: "/qr-code-generator",
        icon: QrCode,
      },
      {
        label: "Location Finder",
        path: "/location-finder",
        icon: MapPin,
      },
    ],
  },
];

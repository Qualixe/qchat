import type { Organization, TeamMember } from "@/lib/types";
import { AVATAR_COLORS } from "./avatar-colors";
import { daysAgo } from "./clock";

export const organizations: Organization[] = [
  {
    id: "org_nokshi",
    name: "Nokshi Lifestyle",
    slug: "nokshi",
    plan: "growth",
    timezone: "Asia/Dhaka",
    defaultLanguage: "auto",
    initials: "NL",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "org_glowbox",
    name: "Glowbox Beauty",
    slug: "glowbox",
    plan: "starter",
    timezone: "Asia/Dhaka",
    defaultLanguage: "en",
    initials: "GB",
    color: "bg-rose-500 text-white",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "tm_nadia",
    name: "Nadia Rahman",
    email: "nadia@nokshi.example",
    initials: "NR",
    avatarColor: AVATAR_COLORS[0],
    role: "owner",
    title: "Founder",
    availability: "online",
    joinedAt: daysAgo(420),
  },
  {
    id: "tm_tanvir",
    name: "Tanvir Hasan",
    email: "tanvir@nokshi.example",
    initials: "TH",
    avatarColor: AVATAR_COLORS[4],
    role: "admin",
    title: "Operations Lead",
    availability: "online",
    joinedAt: daysAgo(390),
  },
  {
    id: "tm_farhana",
    name: "Farhana Akter",
    email: "farhana@nokshi.example",
    initials: "FA",
    avatarColor: AVATAR_COLORS[3],
    role: "agent",
    title: "Customer Support",
    availability: "online",
    joinedAt: daysAgo(240),
  },
  {
    id: "tm_imran",
    name: "Imran Chowdhury",
    email: "imran@nokshi.example",
    initials: "IC",
    avatarColor: AVATAR_COLORS[1],
    role: "agent",
    title: "Customer Support",
    availability: "away",
    joinedAt: daysAgo(180),
  },
  {
    id: "tm_sadia",
    name: "Sadia Islam",
    email: "sadia@nokshi.example",
    initials: "SI",
    avatarColor: AVATAR_COLORS[5],
    role: "agent",
    title: "Sales Associate",
    availability: "offline",
    joinedAt: daysAgo(95),
  },
  {
    id: "tm_rafi",
    name: "Rafi Ahmed",
    email: "rafi@nokshi.example",
    initials: "RA",
    avatarColor: AVATAR_COLORS[2],
    role: "viewer",
    title: "Marketing",
    availability: "away",
    joinedAt: daysAgo(40),
  },
];

/** The signed-in user for this frontend-only demo. */
export const CURRENT_USER_ID = "tm_nadia";

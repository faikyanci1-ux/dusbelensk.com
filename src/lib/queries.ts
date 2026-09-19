/**
 * Tek giriş noktası: bugün /src/data içindeki statik dosyalardan okuyor.
 * Admin panel + Postgres devreye girdiğinde sadece bu dosyanın gövdesi
 * db sorgularına çevrilecek; sayfalar (page.tsx) hiç değişmeyecek.
 */
import { players, type Player } from "@/data/players";
import { staff, type StaffMember } from "@/data/staff";
import {
  managementBoard,
  managementBoardNote,
  auditBoard,
  auditBoardNote,
  type BoardMember,
} from "@/data/board";
import { lineup, lineupNote, type LineupSlot } from "@/data/lineup";
import { gallery, type GalleryItem } from "@/data/gallery";
import { news, type NewsItem } from "@/data/news";
import { club, stats, statsBlurb, values, parentInfo } from "@/data/club";
import { videos, type VideoItem } from "@/data/videos";
import { faq, type FaqItem } from "@/data/faq";
import { events, type EventItem } from "@/data/events";
import { program, type ProgramGroup } from "@/data/program";

export async function getClubInfo() {
  return club;
}

export async function getStats() {
  return stats;
}

export async function getStatsBlurb() {
  return statsBlurb;
}

export async function getValues() {
  return values;
}

export async function getParentInfo() {
  return parentInfo;
}

export async function getPlayers(): Promise<Player[]> {
  return players;
}

export async function getStaff(): Promise<StaffMember[]> {
  return staff;
}

export async function getManagementBoard(): Promise<{ members: BoardMember[]; note: string }> {
  return { members: managementBoard, note: managementBoardNote };
}

export async function getAuditBoard(): Promise<{ members: BoardMember[]; note: string }> {
  return { members: auditBoard, note: auditBoardNote };
}

export async function getLineup(): Promise<{ slots: LineupSlot[]; note: string }> {
  return { slots: lineup, note: lineupNote };
}

export async function getGallery(): Promise<GalleryItem[]> {
  return gallery;
}

export async function getNews(): Promise<NewsItem[]> {
  return news;
}

export async function getVideos(): Promise<VideoItem[]> {
  return videos;
}

export async function getFaq(): Promise<FaqItem[]> {
  return [...faq];
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  return events;
}

export async function getProgram(): Promise<ProgramGroup[]> {
  return [...program];
}

export type LeadershipHighlight = {
  name: string;
  role: string;
  quote: string;
  photo: string;
  href: string;
};

/** Yönetim/teknik kadrodan, posterli tanıtım görseli olan isimler — anasayfa slider'ı için. */
export async function getLeadershipHighlights(): Promise<LeadershipHighlight[]> {
  const boardHighlights: LeadershipHighlight[] = managementBoard
    .filter((member): member is BoardMember & { photo: string; quote: string } =>
      Boolean(member.photo && member.quote)
    )
    .map((member) => ({ name: member.name, role: member.role, quote: member.quote, photo: member.photo, href: "/yonetim" }));

  const staffHighlights: LeadershipHighlight[] = staff
    .filter((member): member is StaffMember & { quote: string } => Boolean(member.quote))
    .map((member) => ({ name: member.name, role: member.role, quote: member.quote, photo: member.photo, href: "/teknik-kadro" }));

  return [...boardHighlights, ...staffHighlights];
}

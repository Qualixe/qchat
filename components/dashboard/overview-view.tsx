"use client";

import { useMemo, useState } from "react";
import { Bot, CheckCircle2, MessagesSquare, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { StatCard } from "@/components/shared/stat-card";
import { ChannelIcon, CHANNEL_META } from "@/components/shared/brand-icons";
import { ChartCard } from "@/components/charts/chart-card";
import { AiVsHumanChart, ConversationVolumeChart } from "@/components/charts/charts";
import { BarList } from "@/components/charts/bar-list";
import { AnalyticsFilters, CHANNEL_COLOR } from "@/components/charts/analytics-filters";
import { AiUsageCard } from "@/components/ai-assistant/ai-usage-card";
import { delta, getSeries, summarize, type ChannelFilter, type RangeDays } from "@/lib/analytics";
import { TOPIC_LABELS, TOPIC_SHARE } from "@/lib/mock-data/analytics";
import { formatDuration, formatNumber, formatPercent, formatShortDate } from "@/lib/format";
import { useCurrentUser } from "@/lib/store/hooks";
import type { ChannelId, ConversationTopic } from "@/lib/types";
import { ActivityFeed } from "./activity-feed";
import { ConnectedChannelsCard } from "./connected-channels-card";
import { RecentConversations } from "./recent-conversations";

export function OverviewView() {
  const [range, setRange] = useState<RangeDays>(7);
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const user = useCurrentUser();

  const series = useMemo(() => getSeries(range, channel), [range, channel]);
  const current = useMemo(() => summarize(series), [series]);
  const previous = useMemo(() => summarize(getSeries(range, channel, 1)), [range, channel]);
  const allChannels = useMemo(() => getSeries(range, "all"), [range]);

  const topics = useMemo(
    () =>
      (Object.keys(TOPIC_SHARE) as ConversationTopic[])
        .map((topic) => ({
          key: topic,
          label: TOPIC_LABELS[topic],
          value: Math.round(current.totalConversations * TOPIC_SHARE[topic]),
        }))
        .slice(0, 5),
    [current.totalConversations],
  );

  const channels = useMemo(() => {
    return (Object.keys(CHANNEL_META) as ChannelId[])
      .map((c) => ({
        key: c,
        label: CHANNEL_META[c].label,
        value: allChannels.reduce((sum, d) => sum + d.byChannel[c], 0),
        icon: <ChannelIcon channel={c} />,
        color: CHANNEL_COLOR[c],
      }))
      .sort((a, b) => b.value - a.value);
  }, [allChannels]);

  const table = {
    headers: ["Date", "Conversations", "Resolved", "Resolved by AI", "Handled by team"],
    rows: series.map((d) => [formatShortDate(d.date), d.conversations, d.resolved, d.aiResolved, d.humanHandled]),
  };

  return (
    <PageContainer>
      <PageIntro
        description={
          <>
            Good afternoon, {user.name.split(" ")[0]}. Here&apos;s how your conversations are performing.
          </>
        }
        actions={<AnalyticsFilters range={range} onRangeChange={setRange} channel={channel} onChannelChange={setChannel} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Total conversations"
          value={formatNumber(current.totalConversations)}
          icon={MessagesSquare}
          change={delta(current.totalConversations, previous.totalConversations)}
        />
        <StatCard
          label="Conversations resolved"
          value={formatNumber(current.resolved)}
          icon={CheckCircle2}
          change={delta(current.resolved, previous.resolved)}
        />
        <StatCard
          label="AI resolution rate"
          value={formatPercent(current.aiResolutionRate, 1)}
          icon={Bot}
          change={delta(current.aiResolutionRate, previous.aiResolutionRate)}
        />
        <StatCard
          label="Avg. first response"
          value={formatDuration(current.avgFirstResponseSec)}
          icon={Timer}
          change={delta(current.avgFirstResponseSec, previous.avgFirstResponseSec)}
          invert
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Conversation volume" description={`Daily conversations, last ${range} days`} table={table}>
          <ConversationVolumeChart data={series} />
        </ChartCard>
        <ChartCard title="AI vs. human-handled" description="Who resolved each day's conversations" table={table}>
          <AiVsHumanChart data={series} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <RecentConversations channel={channel} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Top conversation topics</CardTitle>
                <CardDescription className="text-xs">Detected automatically from messages</CardDescription>
              </CardHeader>
              <CardContent>
                <BarList items={topics} />
              </CardContent>
            </Card>
            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Channel distribution</CardTitle>
                <CardDescription className="text-xs">All channels, last {range} days</CardDescription>
              </CardHeader>
              <CardContent>
                <BarList items={channels} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <AiUsageCard />
          <ConnectedChannelsCard />
          <ActivityFeed />
        </div>
      </div>
    </PageContainer>
  );
}

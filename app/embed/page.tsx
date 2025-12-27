import DiscordWidget from "@/components/discord-widget";

export default async function Embed({
  searchParams,
}: {
  searchParams: Promise<{
    guild?: string;
    type?: string;
    color?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-transparent">
    <DiscordWidget
      guildId={params.guild ?? "1444100565687603333"}
      type={params.type === "small" ? "small" : "full"}
      color={params.color ?? "#1FBADF"}
    />
    </div>
  );
}

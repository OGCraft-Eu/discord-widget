import DiscordWidget from "@/components/discord-widget";

export const dynamic = "force-dynamic";

type EmbedPageProps = {
  searchParams: Promise<{
    guild?: string;
    type?: "small" | "full";
    color?: string;
  }>;
};

export default async function Embed({ searchParams }: EmbedPageProps) {
  const params = await searchParams;

  if (!params.guild) return null;

  return (
    <div className="flex items-center justify-center p-4">
      <DiscordWidget
        guildId={params.guild}
        type={params.type === "small" ? "small" : "full"}
        color={params.color}
      />
    </div>
  );
}

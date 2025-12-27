import Image from "next/image";
import { headers } from "next/headers";

type Member = {
  id: string;
  username: string;
  discriminator: string;
  avatar_url?: string | null;
  status?: "online" | "idle" | "dnd" | "offline";
  game?: { name: string };
};

type Widget = {
  id: string;
  name: string;
  instant_invite?: string;
  presence_count?: number;
  members?: Member[];
};

type GuildMeta = {
  name?: string;
  icon?: string | null;
  banner?: string | null;
  total?: number;
  online?: number;
};

function iconUrl(guildId: string, icon?: string | null) {
  if (icon) {
    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=512`;
  }
  return "https://cdn.discordapp.com/embed/avatars/0.png";
}

export default async function DiscordWidget({
  guildId,
  type = "full",
  color = "#5865f2",
}: {
  guildId: string;
  type?: "full" | "small";
  color?: string;
}) {
  const h = headers();
  const host = (await h).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const [widgetRes, metaRes] = await Promise.all([
    fetch(`https://discord.com/api/v10/guilds/${guildId}/widget.json`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/discord/guild?id=${guildId}`, {
      cache: "no-store",
    }),
  ]);

  if (!widgetRes.ok) return null;

  const widget: Widget = await widgetRes.json();
  const meta: GuildMeta | null = metaRes.ok ? await metaRes.json() : null;

  const members = widget.members ?? [];
  const online = widget.presence_count ?? members.length;
const total = meta?.total ?? online;
const offline = Math.max(0, total - online);

  const name = meta?.name ?? widget.name;
  const icon = iconUrl(guildId, meta?.icon);

  if (type === "small") {
    return (
      <a
        href={widget.instant_invite}
        target="_blank"
        className="block w-full max-w-sm overflow-hidden rounded-xl bg-[#1e1f22] shadow-lg ring-1 ring-white/5 transition hover:scale-[1.02]"
      >
        <div className="flex items-center gap-4 p-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <Image src={icon} alt="" fill unoptimized className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{name}</div>
            <div className="text-xs text-[#b5bac1]">
              {online} online • {offline} offline
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1e1f22] shadow-lg ring-1 ring-white/5">
      <div className="relative h-32 w-full">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${color}55, #1e1f22)`,
          }}
        />
      </div>

      <div className="relative -mt-8 flex items-center gap-4 px-5 pb-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-[#1e1f22]">
          <Image src={icon} alt="" fill unoptimized className="object-cover" />
        </div>

        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="text-sm text-[#b5bac1]">{online} online</div>
        </div>

        {widget.instant_invite && (
          <a
            href={widget.instant_invite}
            target="_blank"
            className="ml-auto rounded-md px-3 py-1.5 text-xs font-medium text-white"
            style={{ backgroundColor: color }}
          >
            Join
          </a>
        )}
      </div>

      <div className="px-5 py-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#b5bac1]">
          Online Members
        </div>

        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
            >
              <div className="relative h-9 w-9">
                {m.avatar_url ? (
                  <Image
                    src={m.avatar_url}
                    alt=""
                    fill
                    unoptimized
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#313338] text-sm font-semibold text-white">
                    {m.username.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {m.username}
                </div>
                <div className="truncate text-xs text-[#b5bac1]">
                  {m.game?.name ?? `#${m.discriminator}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {widget.instant_invite && (
        <div className="border-t border-white/5 px-5 py-3">
          <a
            href={widget.instant_invite}
            target="_blank"
            className="block text-center text-xs font-medium hover:underline"
            style={{ color }}
          >
            Open Invite in Discord
          </a>
        </div>
      )}
    </div>
  );
}

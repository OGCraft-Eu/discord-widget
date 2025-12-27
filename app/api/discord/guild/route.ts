import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("id");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guild id" }, { status: 400 });
  }

  const token = process.env.DISCORD_BOT_TOKEN ?? "";
  const censoredToken = token ? `${token.slice(0, 4)}...${token.slice(-4)}` : "(missing)";
  console.log(`Using Authorization: Bot ${censoredToken}`);

  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Discord error" }, { status: res.status });
  }

  const guild = await res.json();

  return NextResponse.json({
    name: guild.name,
    icon: guild.icon,
    banner: guild.banner,
  });
}

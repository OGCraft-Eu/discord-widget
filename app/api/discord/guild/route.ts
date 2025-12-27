import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("id");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guild id" }, { status: 400 });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Discord error" }, { status: res.status });
  }

  const guild = await res.json();

  return NextResponse.json({
    name: guild.name,
    icon: guild.icon,
    banner: guild.banner,
    total: guild.approximate_member_count,
    online: guild.approximate_presence_count,
  });
}

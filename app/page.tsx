import DiscordWidget from "../components/discord-widget";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 py-24 px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">OG Craft - Discord Widget</h1>
        <div className="w-full">
          <DiscordWidget guildId="1444100565687603333" />
        </div>
      </main>
    </div>
  );
}

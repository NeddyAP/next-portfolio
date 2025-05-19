"use client";

import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { Badge } from "@/components/ui/badge";
import { Database, Json } from "@/types/supabase"; // Import Supabase types
import { getIcon } from "@/lib/iconMap"; // Import the icon mapper

// Define the expected structure for hobbies, skillset, and tools from Supabase (JSONB)
interface IconWithName {
  name: string;
  icon_name: string;
}

interface Quote {
  text: string;
  author: string;
}

// Define props for the component
interface AboutMeProps {
  aboutData: Database["public"]["Tables"]["about_me"]["Row"] | null;
}

export default function AboutMe({ aboutData }: AboutMeProps) {
  if (!aboutData) {
    return (
      <section id="about" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
          About Me
        </h2>
        <p className="text-muted-foreground text-center">Loading about me information...</p>
      </section>
    );
  }

  // Type assertion for hobbies, skillset, tools, and quote
  const hobbies = (aboutData.hobbies as unknown as IconWithName[] | null) || [];
  const skillset = (aboutData.skillset as unknown as IconWithName[] | null) || [];
  const tools = (aboutData.tools as unknown as IconWithName[] | null) || [];
  const quote = (aboutData.quote as unknown as Quote | null);
  const githubUsername = aboutData.github_url ? aboutData.github_url.split('/').pop() : "";

  return (
    <section id="about" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
        About Me
      </h2>
      <div className="space-y-6">
        <p className="text-muted-foreground">{aboutData.bio || "Bio not available."}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {hobbies.map((hobby, index) => {
            const IconComponent = getIcon(hobby.icon_name);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm py-1.5 px-3 flex items-center gap-2"
              >
                {IconComponent && <IconComponent className="text-primary h-4 w-4" />}
                {hobby.name}
              </Badge>
            );
          })}
        </div>
        {quote && (
          <div className="space-y-1">
            <p className="text-primary italic">
              "{quote.text}"
            </p>
            <footer className="text-sm text-muted-foreground">
              - {quote.author}
            </footer>
          </div>
        )}
      </div>

      <div className="space-y-32">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Professional <span className="text-primary">Skillset</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {skillset.map((skill, index) => {
              const IconComponent = getIcon(skill.icon_name);
              return (
                <motion.div
                  key={index}
                  className="group relative flex items-center justify-center p-4 rounded-lg bg-gray-800 bg-opacity-25 hover:bg-accent transition-colors text-4xl"
                  title={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  {IconComponent && <IconComponent />}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Tools & <span className="text-primary">Technologies</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tools.map((tool, index) => {
              const IconComponent = getIcon(tool.icon_name);
              return (
                <motion.div
                  key={index}
                  className="group relative flex items-center justify-center p-4 rounded-lg bg-gray-800 bg-opacity-25 hover:bg-accent transition-colors text-4xl"
                  title={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  {IconComponent && <IconComponent />}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tool.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {githubUsername && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">
              Days I <span className="text-primary">Code</span>
            </h2>
            <div className="flex justify-center">
              <GitHubCalendar
                username={githubUsername}
                blockSize={15}
                blockMargin={5}
                fontSize={16}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

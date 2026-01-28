import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

import prisma from '@/lib/prisma';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

const authConfig: NextAuthConfig = {
  providers: [Google],
  adapter: UpstashRedisAdapter(redis),
  events: {
    async signIn(message) {
      if (!message.user.email || !message.user.name) {
        return;
      }

      const data = {
        email: message.user.email,
        username: message.user.name,
      };

      try {
        await prisma.user.upsert({
          where: { email: message.user.email },
          update: data,
          create: data,
        });
      } catch (error) {
        console.error('Database error', error);
      }
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
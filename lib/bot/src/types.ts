import { Context } from "grammy";
import type { Db } from "mongodb";

export type BotInjectedContext = {
  db: Db;
};

export type BotFullContext = Context & BotInjectedContext;

export type Command = {
  name?: string;
  main?: (ctx: BotFullContext) => Promise<void>;
  routes?: Record<string, (ctx: BotFullContext) => Promise<void>>;
};

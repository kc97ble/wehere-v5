import { Context } from "grammy";
import type { Db } from "mongodb";

export type BotInjectedContext = {
  db: Db;
};

export type BotFullContext = Context & BotInjectedContext;

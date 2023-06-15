import { EmbedBuilder } from "@discordjs/builders";
import { Injectable, Logger } from "@nestjs/common";
import { Colors } from "discord.js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { RawUpdatesInterface } from "./interfaces/raw-updates.inteface";
import { Updates } from "./types/updates.type";

@Injectable()
export class BotUpdateAdvertisementEmbed {
  private readonly logger = new Logger(BotUpdateAdvertisementEmbed.name);
  private readonly pathToUpdates = resolve(process.cwd(), './updates.json');

  public ready = false;
  public forVersion: string;
  public wasUsed: boolean;

  private updates: Updates;

  constructor() {
    if (existsSync(this.pathToUpdates)) {
      this.transformUpdates(readFileSync(this.pathToUpdates, 'utf8'));
      this.ready = true;
    } else {
      this.logger.warn(`No updates.json was found in ${this.pathToUpdates}`);
    }
  }

  public setUsed() {
    const updates: RawUpdatesInterface = {
      ...this.updates,
      forVersion: this.forVersion,
      wasUsed: true,
    };

    writeFileSync(this.pathToUpdates, JSON.stringify(updates, undefined, 2));
  }

  public buildEmbed() {
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('Обновление бота.')
      .setDescription(`Версия: **\`${this.forVersion}\`**`)
      .setTimestamp();

      console.log(this.updates);
    if (this.updates.majorUpdates.length) {
      embed.addFields({
        name: 'Глобальные изменения:',
        value: this.updates.majorUpdates.join('\n'),
      });
    }

    if (this.updates.minorUpdates.length) {
      embed.addFields({
        name: 'Небольшие изменения:',
        value: this.updates.minorUpdates.join('\n'),
      });
    }

    if (this.updates.bugFixes.length) {
      embed.addFields({
        name: 'Исправления багов:',
        value: this.updates.bugFixes.join('\n'),
      });
    }

    if (this.updates.addedFunctionality.length) {
      embed.addFields({
        name: 'Добавленный функционал:',
        value: this.updates.addedFunctionality.join('\n'),
      });
    }

    if (this.updates.removedFunctionality.length) {
      embed.addFields({
        name: 'Удаленный функционал:',
        value: this.updates.removedFunctionality.join('\n'),
      });
    }

    if (this.updates.other.length) {
      embed.addFields({
        name: 'Прочее:',
        value: this.updates.other.join('\n'),
      });
    }

    return embed;
  }

  private transformUpdates(rawUpdates: string) {
    const updates = JSON.parse(rawUpdates) as RawUpdatesInterface;
    if (!updates.forVersion) this.logger.warn('updates.json has no forVersion property!');
    if (updates.wasUsed === undefined) this.logger.warn('updates.json has no wasUsed property!');

    this.forVersion = updates.forVersion ? updates.forVersion : "0.0.0";
    this.wasUsed = updates.wasUsed ?? false;

    function removeNullableValues<Input extends U[] | undefined, U>(input: Input): U[] {
      if (Array.isArray(input)) {
        const filteredArray = input.filter(Boolean);
        if (filteredArray.length == 0) return [];
        return filteredArray;
      }
      return [];
    }

    this.updates = {
      majorUpdates: removeNullableValues(updates.majorUpdates),
      minorUpdates: removeNullableValues(updates.minorUpdates),
      bugFixes: removeNullableValues(updates.bugFixes),
      addedFunctionality: removeNullableValues(updates.addedFunctionality),
      removedFunctionality: removeNullableValues(updates.removedFunctionality),
      other: removeNullableValues(updates.other),
    };

  }

}
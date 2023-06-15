import { Injectable, Logger } from "@nestjs/common";
import { Colors, EmbedBuilder, Events, GuildMember, PartialGuildMember, Routes } from "discord.js";
import { Context, ContextOf, On } from "necord";
import { NewApiUser } from "./new-api-user.type";

@Injectable()
export class MemberLeavingNotificationService {
  private readonly logger = new Logger(MemberLeavingNotificationService.name);

  @On(Events.GuildMemberRemove)
  private async onGuildMemberRemove(@Context() [guildMember]: ContextOf<Events.GuildMemberRemove>) {
    if (!guildMember.guild.systemChannel) return this.logger.warn('No guild system channel.');

    const joinedAt = guildMember.joinedAt?.getTime();
    if (!joinedAt) return this.logger.warn(`Member ${guildMember.user.username} has no joinedAt attribute.`);

    const apiUser = await guildMember.client.rest.get(Routes.user(guildMember.user.id)) as NewApiUser;

    const wasOnTheServerMinites = this.timestampToMinutes((Date.now() - joinedAt));
    const wasOnTheServerString = this.formatTime(wasOnTheServerMinites);

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        iconURL: guildMember.displayAvatarURL(),
        name: this.parseGuildMemberName(guildMember, apiUser) + ' вышел с сервера.',
      })
      .setDescription(`<@${guildMember.user.id}>`)
      .setFields(
        {
          name: 'Присоединился:',
          value: `<t:${wasOnTheServerMinites}:f>`,
        },
        {
          name: 'Пробыл на сервере:',
          value: '`' + wasOnTheServerString + '`',
        }
      );

    guildMember.guild.systemChannel.send({
      embeds: [embed],
    });
  }

  private parseGuildMemberName(guildMember: GuildMember | PartialGuildMember, apiUser: NewApiUser) {
    const discriminator = apiUser.discriminator; // "0" or "1111"
    const username      = apiUser.username;      // @"frys" or "Frys"
    const global_name   = apiUser.global_name;   // "Frys" or null
    const nickname      = guildMember.nickname;  // "FrysInGuild" or null

    // "FrysInGuild (Frys#1111)" or "Frys#1111" or "FrysInGuild (@frys)" or "@frys"
    let tag = nickname ?? '';

    // If this is a new User
    if (
      global_name !== null &&
      discriminator === '0'
    ) {
      tag += `@${username}`;
    }

    // If this is a old User
    else if (
      global_name === null &&
      discriminator !== '0'
    ) {
      tag += `${username}#${discriminator}`;
    }

    else {
      this.logger.warn(`Can't parse GuildMemberName. Discriminator: ${discriminator}, Username: ${username}, GlobalName: ${global_name}`);
    }

    return tag;
  }

  private timestampToMinutes(timestamp: number) {
    return Math.floor(timestamp / 1000 / 60);
  }

  private formatTime(minutes: number) {
    minutes = Math.floor(minutes);

    const minutesInDay = 24 * 60;
    const minutesInMonth = 30 * minutesInDay;

    const months = Math.floor(minutes / minutesInMonth);
    const days = Math.floor((minutes % minutesInMonth) / minutesInDay);
    const hours = Math.floor((minutes % minutesInDay) / 60);
    const mins = minutes % 60;

    const monthLabel = this.getLabel(months, ['месяц', 'месяца', 'месяцев']);
    const dayLabel = this.getLabel(days, ['день', 'дня', 'дней']);
    const hourLabel = this.getLabel(hours, ['час', 'часа', 'часов']);
    const minLabel = this.getLabel(mins, ['минута', 'минуты', 'минут']);

    let result = '';

    if (months > 0) result += `${months} ${monthLabel} `;
    if (days > 0)   result += `${days} ${dayLabel} `;
    if (hours > 0)  result += `${hours} ${hourLabel} `;
    if (mins > 0)   result += `${mins} ${minLabel} `;

    result = result.trim();

    return Number(result) < 1 ? 'менее минуты' : result;
  }

  private getLabel(number: number, labels: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5];
    return labels[index];
  }
}
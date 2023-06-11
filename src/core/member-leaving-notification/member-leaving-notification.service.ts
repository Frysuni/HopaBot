import { Injectable } from "@nestjs/common";
import { Events } from "discord.js";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class MemberLeavingNotificationService {

  @On(Events.GuildMemberRemove)
  private async onGuildMemberRemove(@Context() [guildMember]: ContextOf<Events.GuildMemberRemove>) {
    if (!guildMember.guild.systemChannel) return;

    // guildMember.guild.systemChannel?.send();
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
/**
 * Slash-command to generate an embed with classes to be created / archived, with button confirmation
 * # Button
 * * Creates two buttons, confirmation with CustomId 'semester-start', and cancellation with CustomId 'cancel'.
 * Implementation defined in the {@link events/semesterstart | Semester button handler}
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonStyle } from 'discord.js';
import { getListFromFile, getSemester } from '../helpers/functions';
import { CourseRole } from '../helpers/role';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('startsemester')
    .setDescription('Archive old courses, initialize new ones, transfer over student roles.')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const prevCourses = getListFromFile('data/prevsemester.json') as CourseRole[];
    const newCourses = getListFromFile('data/courses.json') as CourseRole[];
    const prevCoursesNames: string[] = [];
    const newCoursesNames: string[] = [];
    prevCourses.forEach(elem => prevCoursesNames.push(elem.name));
    newCourses.forEach(elem => newCoursesNames.push(elem.name));
    const semesterValue = getSemester();
    if (!semesterValue) {
      await interaction.reply({ content: 'Please use /setsemester to set a time period first (e.g. Winter 2022)', ephemeral: true });
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle('Semester Confirmation')
      .setColor(0xDD7711)
      .setDescription('Are you sure you\'d like to enact the following changes?')
      .addFields(
        { name: 'New semester value', value: semesterValue },
        { name: 'Previous courses to be archived', value: '\n' + prevCoursesNames.join('\n') },
        { name: 'New courses to be created', value: '\n' + newCoursesNames.join('\n') },
      )
      .setFooter({ text: 'Only click confirm if you\'re certain these courses can be archived. This action is destructive.' });
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('semester-start')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary),
      );
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
/**
 * Handles a stringSelectMenu with CustomId 'reaction-roles',
 * adding the selected role onto users when values are entered
 * # Command
 * * This menu is generated by the {@link commands/optrolesbuilder | Optional role menu command}
 * @packageDocumentation
 */
import { Events, BaseInteraction, GuildMemberRoleManager } from 'discord.js';
import { getListFromFile } from '../../helpers/functions';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'reaction-roles')) return;
    if (!(interaction.guild && interaction.member)) return;
    await interaction.deferReply({ ephemeral: true });
    const addedRoles = [];
    const rolesList = getListFromFile('data/optroles.json');
    const rolesSelected = interaction.values;
    // Assign roles
    for (const role of rolesList) {
      const optRole = await interaction.guild.roles.fetch(role.role.id);
      if (optRole) {
        const roles = interaction.member.roles as GuildMemberRoleManager;
        await roles.remove(optRole);
        for (const selection of rolesSelected) {
          if (selection === role.name) {
            // Course = course to add, selection = selection matching that
            await roles.add(optRole);
            addedRoles.push(optRole.name);
          }
        }
      }
    }
    await interaction.editReply({ content: 'Roles added: ' + addedRoles.join(', '), components: [] });
  },
};
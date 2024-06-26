/**
 * Menu that takes a selected course and creates a server category,
 * populated with channels and messages, based on a selected role.
 * Takes several seconds to run, so its response needs to be deferred.
 * # Command
 * * This menu is generated by the
 * {@link commands/testing/createcoursecategory | Create course category command}.
 * @packageDocumentation
 */
import { Events, BaseInteraction } from 'discord.js';
import { checkCategory, createAndPopulateCategory, getListFromFile } from '../../helpers/functions';
import { CourseRole } from '../../helpers/role';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'create-category')) return;
    if (!interaction.guild) return;
    await interaction.deferUpdate();
    let rolesList = getListFromFile('data/courses.json') as CourseRole[];
    const courseSelectedString = interaction.values[0];
    const selectedCourseObject = rolesList.find((element: CourseRole) => element.name === courseSelectedString);
    if (selectedCourseObject != undefined) {
      const selectedCourse = rolesList.indexOf(selectedCourseObject);
      const guild = interaction.guild;
      checkCategory(selectedCourseObject);
      rolesList = getListFromFile('data/courses.json') as CourseRole[];
      let category = rolesList[selectedCourse].category;
      if (rolesList[selectedCourse]) {
        if (category) {
          if (await guild.channels.cache.has(category.id)) {
            await interaction.editReply({ content: 'Sorry, that category already exists, it was possibly created as part of a joint course.', components: [] });
            return;
          }
        }
        if (!category) category = await createAndPopulateCategory(rolesList[selectedCourse], guild.channels);
        const jointChild = rolesList.find(elem => elem.name === rolesList[selectedCourse].jointClass);
        if (jointChild) rolesList[rolesList.indexOf(jointChild)].category = category;
        await interaction.editReply({ content: 'Category created!', components: [] });
      }
      // Shouldn't reach here, but the error-check is necessary for compilation
      else await interaction.editReply('Sorry, that role wasn\'t found in the list.');
    }
  },
};
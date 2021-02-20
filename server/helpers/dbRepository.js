/**
 * @fileoverview Contains the User Auth Repository class, an interface for querying User table
 * @param {String} password - Password to be hashed
 * @returns {String} Encrypted password
 * @memberof Helper
 */

class dbRepository {
  /**
     * @description constructor handles the model instantiations whenever the class is called upon
     *
     * @constructor handles the instantaneous variables
     *
     */
  constructor(User) {
    this.db = User;
  }

  /**
     * @description Creates a new account with provided details
     *
     * @param {Object} param users details
     *
     * @return {Object} returns newly created details
     */
  async createOne(paylaod = {}) {
    const { dataValues } = await this.db.create(paylaod);
    return dataValues;
  }

  /**
     * @description Creates new accounts with provided details
     *
     * @param {Object} param users details
     *
     * @return {Object} returns newly created details
     */
  async createAll(paylaod = {}) {
    const { dataValues } = await this.db.bulkCreate(paylaod);
    return dataValues;
  }

  /**
     * @description Returns newly found details based on the provided parameters
     *
     * @param {Object} condition checks required parameter that find is premised
     *
     * @param {Object} include adds additional info
     *
     * @return {Object} returns founded details
     */
  async getOne(condition = {}, include = '') {
    return await this.db.findOne({ where: condition, include });
    // return dataValues;
  }

  /**
     * @description Returns newly found details based on the provided parameters
     *
     * @param {Object} condition checks required parameter that find is premised
     *
     * @param {Object} include adds additional info
     *
     * @return {Object} returns founded details
     */
  async getAll(condition = {}, include = '') {
    if (condition) return await this.db.findAll({ where: condition, include });
    return await this.db.findAll();
  }

  /**
     *
     * @param {string} changes
     *
     * @param {object} userId to update for user
     *
     * @returns {object} updated user
     */
  async getTwo(condition = {}, otherModel) {
    try {
      return await this.db.findAll({
        where: condition,
        include: [{
          model: otherModel,
          required: false
        }]
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
     * @description Removes a particular detail based on the provided parameters
     *
     * @param {Object} condition checks required parameter
     *
     * @param {Object} include adds any additional info if exist
     *
     * @return {Object} returns removed detailsd
     */

  async destroyOne(condition = {}) {
    return await this.db.destroy({ where: condition });
  }

  /**
     *
     * @param {string} changes- the required fieds to be updated
     *
     * @param {object} condition checks required parameter
     *
     * @returns {object} updated updated info
     */
  async updateOne(changes = {}, condition) {
    const { dataValues } = await this.db.update(changes, { where: condition });
    return dataValues;
  }
}
export default dbRepository;

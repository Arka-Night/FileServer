
exports.up = function(knex) {
    return knex.schema.createTable('ClientId', (table) => {
        table.increments('clientId');
        table.string('clientName').notNullable();
        table.string('arquive').notNullable();
    });

};

exports.down = function(knex) {
    return knex.schema.dropTable('ClientId');

};

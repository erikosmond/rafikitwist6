class AddSelectedRecipesView < ActiveRecord::Migration[5.1]
  def up
    command = %(
      CREATE OR REPLACE VIEW selected_recipes AS
      SELECT * from recipes;
    )
    execute command
  end

  def down
    command = %(
      DROP VIEW selected_recipes;
    )
    execute command
  end
end

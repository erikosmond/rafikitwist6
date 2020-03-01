class CreateRecipes < ActiveRecord::Migration[5.1]
  def change
    create_table :recipes do |t|
      t.string :name, null: false
      t.text :description
      t.text :instructions, null: false
      t.timestamps
    end
    add_index :recipes, :name
  end
end

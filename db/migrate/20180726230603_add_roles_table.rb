# frozen_string_literal: true

# migration to add roles table
class AddRolesTable < ActiveRecord::Migration[5.1]
  def change
    create_table :roles do |t|
      t.string :name, null: false
      t.timestamps
    end
  end
end

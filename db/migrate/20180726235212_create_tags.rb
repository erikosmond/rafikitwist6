# frozen_string_literal: true

# Migration to create tags table
class CreateTags < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.string :description
      t.references :tag_type, null: false
      t.references :recipe
      t.timestamps
    end
    add_index :tags, :name
  end
end

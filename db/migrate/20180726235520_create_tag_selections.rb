# frozen_string_literal: true

# Migration to create tag_selections table
class CreateTagSelections < ActiveRecord::Migration[5.1]
  def change
    create_table :tag_selections do |t|
      t.references :tag, null: false
      t.string :taggable_type, null: false
      t.integer :taggable_id, null: false
      t.text :body
      t.timestamps
    end
    add_index :tag_selections, %i[taggable_id taggable_type]
  end
end

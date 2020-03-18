# frozen_string_literal: true

# Migration to create tag_attributes table
class CreateTagAttributes < ActiveRecord::Migration[5.1]
  def change
    create_table :tag_attributes do |t|
      t.integer :tag_attributable_id, null: false
      t.string :tag_attributable_type, null: false
      t.string :property, null: false
      t.string :value

      t.timestamps
    end
    add_index :tag_attributes,
              %i[tag_attributable_id tag_attributable_type],
              name: 'index_tag_attributes_on_attributable'
  end
end

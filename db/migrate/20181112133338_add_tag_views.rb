# frozen_string_literal: true

# Migration to create tag views
class AddTagViews < ActiveRecord::Migration[5.1]
  def up
    command = %(
      CREATE OR REPLACE VIEW child_tags AS
      SELECT * from tags;
      CREATE OR REPLACE VIEW grandchild_tags AS
      SELECT * from tags;
    )
    execute command
  end

  def down
    command = %(
      DROP VIEW child_tags;
      DROP VIEW grandchild_tags;
    )
    execute command
  end
end

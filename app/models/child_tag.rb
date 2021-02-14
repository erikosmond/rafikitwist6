# frozen_string_literal: true

# child_tags is a simple view in the database: `select * from tags`
# due to the fact that a tag can belong to other tags, the rails SQL generation
# breaks when trying to join a table with the same name multiple times.
# class ChildTag < Tag
  # self.table_name = 'child_tags'

  # belongs_to :tag_type
  # has_many :child_tags,
  #          through: :tag_selections,
  #          source: :taggable,
  #          class_name: 'ChildTag',
  #          source_type: 'Tag'
# end

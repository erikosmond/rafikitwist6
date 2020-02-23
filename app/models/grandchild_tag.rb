# frozen_string_literal: true

# grandchild_tags is a simple view in the database: `select * from tags`
# see top-level class documentation for the child_tag model for more info
class GrandchildTag < Tag
  self.table_name = 'grandchild_tags'
end

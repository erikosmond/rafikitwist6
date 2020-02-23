# frozen_string_literal: true

class DbHelper
  def self.create_views
    dbh = DbHelper.new
    ActiveRecord::Base.connection.execute(dbh.tag_views_sql)
    ActiveRecord::Base.connection.execute(dbh.recipe_view_sql)
  end

  def initialize; end

  def tag_views_sql
    %(
      CREATE OR REPLACE VIEW child_tags AS
      SELECT * from tags;
      CREATE OR REPLACE VIEW grandchild_tags AS
      SELECT * from tags;
    )
  end

  def recipe_view_sql
    %(
      CREATE OR REPLACE VIEW selected_recipes AS
      SELECT * from recipes;
    )
  end
end

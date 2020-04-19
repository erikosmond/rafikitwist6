# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class TagTypesController < ApplicationController
    def index
      grouped = params.permit(:grouped)[:grouped]
      if grouped.present?
        render json: TagType.tags_by_type(current_user.id)
      else
        render json: TagType.all
      end
    end
  end
end

# frozen_string_literal: true

# class for handling params from recipes form
class RecipeForm
  include Interactor

  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     end
  end

  private

    def create(params)
      binding.pry
    end

end

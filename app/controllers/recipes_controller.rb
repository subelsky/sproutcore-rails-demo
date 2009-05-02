class RecipesController < ApplicationController

  def index
    render :text => RecipePresenter.new.to_hash.to_json
  end
  
  def create
    recipe_params = ActiveSupport::JSON.decode(params[:recipe])
    recipe_params.delete('guid') # this is just SproutCore's temporary guid; we'll return the persistent, real guid if this is successful
    recipe = Recipe.create!(recipe_params)
    render :text => recipe.id
  rescue ActiveRecord::RecordInvalid
    render :text => "Unable to create recipe due to #{$!.message}", :status => 403
  end
  
  def update
    logger.info(params.inspect)
  end
  
end
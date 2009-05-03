class RecipesController < ApplicationController

  before_filter :decode_recipe, :only => [:create,:update]
  
  def index
    render :text => RecipePresenter.new.to_hash.to_json
  end
  
  def create
    @recipe_params.delete('guid') # this is just SproutCore's temporary guid; we'll return the persistent, real guid if this is successful
    recipe = Recipe.create!(@recipe_params)
    render :json => recipe.to_hash
  rescue ActiveRecord::RecordInvalid
    render :text => "Unable to create recipe due to #{$!.message}", :status => 403
  end
  
  def update    
    guid = @recipe_params.delete('guid')
    recipe = Recipe.find(guid) # we're counting on find to raise an exception if the recipe not found
    if recipe.update_attributes(@recipe_params)
      render :json => recipe.to_hash
    else
      render :text => "Unable to update recipe due to #{$!.message}", :status => 403
    end
  end

  private
  
  def decode_recipe
    @recipe_params = ActiveSupport::JSON.decode(params[:recipe])
  end
  
end
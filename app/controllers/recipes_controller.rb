class RecipesController < ApplicationController

  def index
    render :text => RecipePresenter.new.to_hash.to_json
  end
  
  def update
    pp params
  end
  
end
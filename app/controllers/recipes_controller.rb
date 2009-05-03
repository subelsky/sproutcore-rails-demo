class RecipesController < ApplicationController

  before_filter :decode_recipe, :only => [:create,:update]

  def index
    response_hash = RecipePresenter.new.to_hash

    if protect_against_forgery?
      response_hash[:rails_auth_token_name] = request_forgery_protection_token
      response_hash[:rails_auth_token] = form_authenticity_token
    end

    render :json => response_hash
  end
  
  def create
    @recipe_params.delete('guid') # this is just SproutCore's temporary guid; we'll return the persistent, real guid if this is successful
    recipe = Recipe.create!(@recipe_params)
    render :json => recipe.to_hash
  rescue ActiveRecord::RecordInvalid
    render :text => "Unable to create recipe due to #{$!.message}", :status => 403
  end
  
  def update    
    recipe = Recipe.find(params[:id])

    if recipe.update_attributes(@recipe_params)
      render :json => recipe.to_hash
    else
      render :text => "Unable to update recipe due to #{recipe.errors.full_messages.join(". ")}", :status => 403
    end
  end

  def destroy
    Recipe.destroy(params[:id])
    render :nothing => true
  end
  
  private
  
  def decode_recipe
    @recipe_params = ActiveSupport::JSON.decode(params[:recipe])
    @recipe_params.delete('guid') # we use the URL id which is the same as the guid
  end
  
end
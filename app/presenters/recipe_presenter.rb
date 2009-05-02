class RecipePresenter
  
  def initialize(params = {})
  end

  def to_hash
    { :records => records }
  end

  private

  def recipes
    @recipes ||= Recipe.find(:all)
  end

  def recipe_ids
    @recipe_ids ||= recipes.collect { |r| r.id }
  end
  
  def records
    @records ||= recipes.map { |recipe| recipe.to_hash }
  end
  
end
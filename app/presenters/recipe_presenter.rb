class RecipePresenter
  
  def initialize(params = {})
  end

  def to_hash
    { :records => records, :ids => recipe_ids }
  end

  private

  def recipes
    @recipes ||= Recipe.find(:all)
  end

  def recipe_ids
    @recipe_ids ||= recipes.collect { |r| r.id }
  end
  
  def records
    unless @records
      @records = recipes.map do |recipe|
        recipe.attributes.merge(:guid => recipe.id, :type => "Recipe")
      end
    end
    return @records
  end
  
end
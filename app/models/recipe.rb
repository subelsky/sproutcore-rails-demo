class Recipe < ActiveRecord::Base

  def to_hash
    attributes.except('id','updated_at','created_at').merge(:guid => self[:id], :type => "Recipe")
  end
  
end

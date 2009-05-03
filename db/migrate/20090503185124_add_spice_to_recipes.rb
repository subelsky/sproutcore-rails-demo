class AddSpiceToRecipes < ActiveRecord::Migration
  def self.up
    add_column :recipes, :spice, :integer
  end

  def self.down
    remove_column :recipes, :spice
  end
end

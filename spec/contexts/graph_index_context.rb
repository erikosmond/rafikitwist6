# frozen_string_literal: true

# rubocop: disable Metrics/BlockLength

# parent tags do not get accesses in production and it works properly

# TODO: double check everything here & outline tests i will write
RSpec.shared_context 'graph_index_context', shared_context: :metadata do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let!(:ingredient_tag_type) { create(:tag_type, name: 'Ingredient') }
  let!(:ingredient_type_tag_type) { create(:tag_type, name: 'IngredientType') }
  let!(:ingredient_family_tag_type) { create(:tag_type, name: 'IngredientFamily') }
  let!(:priority_type) { create(:tag_type, name: 'Priority') }
  let!(:rating_type) { create(:tag_type, name: 'Rating') }
  let!(:flavor_type) { create(:tag_type, name: 'Flavor') }

  let!(:one_star) { create(:tag, name: '1 star', tag_type: rating_type) }
  let!(:five_star) { create(:tag, name: '5 star', tag_type: rating_type) }
  let!(:high_priority) { create(:tag, name: 'high priority', tag_type: priority_type) }
  let!(:low_priority) { create(:tag, name: 'low priority', tag_type: priority_type) }
  let!(:smokey) { create(:tag, name: 'smokey', tag_type: flavor_type) }

  let!(:one_star_access) do
    create(:access, accessible: one_star, user: user1, status: 'PUBLIC')
  end
  let!(:five_star_access) do
    create(:access, accessible: five_star, user: user1, status: 'PUBLIC')
  end
  let!(:high_priority_access) do
    create(:access, accessible: high_priority, user: user1, status: 'PUBLIC')
  end
  let!(:low_priority_access) do
    create(:access, accessible: low_priority, user: user1, status: 'PUBLIC')
  end
  let!(:smokey_access) do
    create(:access, accessible: smokey, user: user1, status: 'PUBLIC')
  end

  # Ingredient family
  let(:plant_protein) do
    create(:tag, name: 'plant protein', tag_type: ingredient_family_tag_type)
  end
  let!(:pp1_access) do
    create(:access, accessible: plant_protein, user: user2, status: 'PRIVATE')
  end
  let(:nut) { create(:tag, name: 'nut', tag_type: ingredient_type_tag_type) }
  let!(:nut1_access) { create(:access, accessible: nut, user: user2, status: 'PRIVATE') }
  let!(:nut_to_protein) { create(:tag_selection, tag: plant_protein, taggable: nut) }

  let(:grains) { create(:tag, name: 'grains', tag_type: ingredient_family_tag_type) }
  let!(:g1_access) { create(:access, accessible: grains, user: user1, status: 'PUBLIC') }
  let(:wheat) { create(:tag, name: 'wheat', tag_type: ingredient_type_tag_type) }
  let!(:w2_access) { create(:access, accessible: wheat, user: user1, status: 'PUBLIC') }
  let!(:wheat_to_grains) { create(:tag_selection, tag: grains, taggable: wheat) }
  let!(:flour_to_wheat) { create(:tag_selection, tag: wheat, taggable: flour) }

  # Ingredient recipes with access
  let(:flour) { create(:tag, name: 'flour', tag_type: ingredient_tag_type) }
  let!(:f1_access) { create(:access, accessible: flour, user: user1, status: 'PUBLIC') }
  let(:water) { create(:tag, name: 'water', tag_type: ingredient_tag_type) }
  let!(:w1_access) { create(:access, accessible: water, user: user1, status: 'PUBLIC') }
  let(:baking_soda) { create(:tag, name: 'baking soda', tag_type: ingredient_tag_type) }
  let!(:baking_soda_access) do
    create(:access, accessible: baking_soda, user: user1, status: 'PUBLIC')
  end

  let!(:self_rising_flour_recipe) { create(:recipe, name: 'self-rising flour') }
  let!(:srfr1_access) do
    create(:access, accessible: self_rising_flour_recipe, user: user1, status: 'PUBLIC')
  end
  let!(:srf1_ing1) do
    create(:tag_selection, tag: flour, taggable: self_rising_flour_recipe)
  end
  let!(:srf1_ing2) do
    create(:tag_selection, tag: baking_soda, taggable: self_rising_flour_recipe)
  end
  let(:self_rising_flour) do
    create(
      :tag,
      {
        name: 'self-rising flour',
        tag_type: ingredient_tag_type,
        recipe_id: self_rising_flour_recipe.id
      }
    )
  end
  let!(:srf1_access) do
    create(:access, accessible: self_rising_flour, user: user1, status: 'PUBLIC')
  end

  let(:pizza_dough_recipe) { create(:recipe, name: 'pizza dough') }
  let!(:pdr1_access) do
    create(:access, accessible: pizza_dough_recipe, user: user1, status: 'PUBLIC')
  end
  let!(:pdr1_ing1) do
    create(:tag_selection, tag: self_rising_flour, taggable: pizza_dough_recipe)
  end
  let!(:pdr1_ing2) do
    create(:tag_selection, tag: water, taggable: pizza_dough_recipe)
  end
  let(:pizza_dough) do
    create(
      :tag,
      {
        name: 'pizza dough',
        tag_type: ingredient_tag_type,
        recipe: pizza_dough_recipe
      }
    )
  end
  let!(:pd1_access) do
    create(:access, accessible: pizza_dough, user: user1, status: 'PUBLIC')
  end

  let(:almond) { create(:tag, name: 'almond', tag_type: ingredient_tag_type) }
  let!(:a5_access) { create(:access, accessible: almond, user: user2, status: 'PRIVATE') }
  let(:sugar) { create(:tag, name: 'sugar', tag_type: ingredient_tag_type) }
  let!(:s2_access) { create(:access, accessible: sugar, user: user2, status: 'PRIVATE') }
  let!(:almond_to_nut) { create(:tag_selection, tag: nut, taggable: almond) }

  # Ingredient Parent Tags
  let(:almond_milk_recipe) { create(:recipe, name: 'almond milk') }
  let!(:amr1_access) do
    create(:access, accessible: almond_milk_recipe, user: user2, status: 'PRIVATE')
  end
  let!(:am1_ing1) { create(:tag_selection, tag: almond, taggable: almond_milk_recipe) }
  let!(:am1_ing2) { create(:tag_selection, tag: water, taggable: almond_milk_recipe) }
  let(:almond_milk) do
    create(
      :tag,
      {
        name: 'almond milk',
        tag_type: ingredient_tag_type,
        recipe_id: almond_milk_recipe.id
      }
    )
  end
  let!(:am1_access) do
    create(:access, accessible: almond_milk, user: user2, status: 'PRIVATE')
  end

  let(:orgeat_recipe) { create(:recipe, name: 'orgeat') }
  let!(:orgr1_access) do
    create(:access, accessible: orgeat_recipe, user: user2, status: 'PRIVATE')
  end
  let!(:org1_ing1) { create(:tag_selection, tag: almond_milk, taggable: orgeat_recipe) }
  let!(:org1_ing2) { create(:tag_selection, tag: sugar, taggable: orgeat_recipe) }
  let(:orgeat) do
    create(
      :tag,
      { name: 'orgeat', tag_type: ingredient_tag_type, recipe_id: orgeat_recipe.id }
    )
  end
  let!(:org1_access) do
    create(:access, accessible: orgeat, user: user2, status: 'PRIVATE')
  end

  # Ingredients with access
  let(:tomato) { create(:tag, name: 'tomato', tag_type: ingredient_tag_type) }
  let!(:t1_access) { create(:access, accessible: tomato, user: user1, status: 'PUBLIC') }
  let(:cheese) { create(:tag, name: 'cheese', tag_type: ingredient_tag_type) }
  let!(:c1_access) { create(:access, accessible: cheese, user: user1, status: 'PUBLIC') }
  let(:onion) { create(:tag, name: 'onion', tag_type: ingredient_tag_type) }
  let!(:o1_access) { create(:access, accessible: onion, user: user1, status: 'PRIVATE') }
  let(:carrot) { create(:tag, name: 'carrot', tag_type: ingredient_tag_type) }
  let!(:c2_access) { create(:access, accessible: carrot, user: user1, status: 'PUBLIC') }
  let(:peas) { create(:tag, name: 'peas', tag_type: ingredient_tag_type) }
  let!(:p1_access) { create(:access, accessible: peas, user: user1, status: 'PUBLIC') }
  let(:potato) { create(:tag, name: 'potato', tag_type: ingredient_tag_type) }
  let!(:p2_access) { create(:access, accessible: potato, user: user1, status: 'PUBLIC') }
  let(:pumpkin) { create(:tag, name: 'pumpkin', tag_type: ingredient_tag_type) }
  let!(:p4_access) { create(:access, accessible: pumpkin, user: user1, status: 'PUBLIC') }
  let(:salt) { create(:tag, name: 'salt', tag_type: ingredient_tag_type) }
  let!(:s1_access) { create(:access, accessible: salt, user: user1, status: 'PUBLIC') }
  let(:pepper) { create(:tag, name: 'pepper', tag_type: ingredient_tag_type) }
  let!(:p5_access) { create(:access, accessible: pepper, user: user1, status: 'PUBLIC') }
  let(:clove) { create(:tag, name: 'clove', tag_type: ingredient_tag_type) }
  let!(:c3_access) { create(:access, accessible: clove, user: user1, status: 'PRIVATE') }
  let(:rum) { create(:tag, name: 'captain morgan rum', tag_type: ingredient_tag_type) }
  let!(:r3_access) { create(:access, accessible: rum, user: user2, status: 'PRIVATE') }

  # Recipes with access
  ## Pizza - showing public nested recipe tags
  let(:pizza) { create(:recipe, name: 'Pizza') }
  let!(:p6_access) { create(:access, accessible: pizza, user: user1, status: 'PUBLIC') }
  let!(:p1ts1) { create(:tag_selection, taggable: pizza, tag: pizza_dough) }
  let!(:p1ts2) { create(:tag_selection, taggable: pizza, tag: tomato) }

  ## Veggie Soup
  let(:veggie_soup) { create(:recipe, name: 'Veggie Soup') }
  let!(:vs1_access) do
    create(:access, accessible: veggie_soup, user: user2, status: 'PUBLIC')
  end
  let!(:p2ts1) { create(:tag_selection, taggable: veggie_soup, tag: potato) }
  let!(:p2ts2) { create(:tag_selection, taggable: veggie_soup, tag: water) }

  ## Veggie Plate
  let(:veggie_plate) { create(:recipe, name: 'Veggie Plate') }
  let!(:vp1_access) do
    create(:access, accessible: veggie_plate, user: user2, status: 'PUBLIC')
  end
  let!(:p3ts1) { create(:tag_selection, taggable: veggie_plate, tag: carrot) }
  let!(:p3ts2) { create(:tag_selection, taggable: veggie_plate, tag: peas) }

  ## Pumpkin Pie
  let(:pumpkin_pie) { create(:recipe, name: 'Pumpkin Pie') }
  let!(:pp2_access) do
    create(:access, accessible: pumpkin_pie, user: user1, status: 'PRIVATE')
  end
  let!(:p4ts1) { create(:tag_selection, taggable: pumpkin_pie, tag: pumpkin) }
  let!(:p4ts2) { create(:tag_selection, taggable: pumpkin_pie, tag: clove) }

  ## Mashed Potatoes
  let(:mashed_potatoes) { create(:recipe, name: 'Mashed Potatoes') }
  let!(:mp1_access) do
    create(:access, accessible: mashed_potatoes, user: user1, status: 'PRIVATE')
  end
  let!(:p5ts1) { create(:tag_selection, taggable: mashed_potatoes, tag: potato) }
  let!(:p5ts2) { create(:tag_selection, taggable: mashed_potatoes, tag: salt) }

  ## Awesome Blossom
  let(:awesome_blossom) { create(:recipe, name: 'Awesome Blossom') }
  let!(:appb1_access) do
    create(:access, accessible: awesome_blossom, user: user2, status: 'PRIVATE')
  end
  let!(:p6ts1) { create(:tag_selection, taggable: awesome_blossom, tag: onion) }
  let!(:p6ts2) { create(:tag_selection, taggable: awesome_blossom, tag: pepper) }

  ## Mai Tai - showing private nested recipe tags
  let(:mai_tai) { create(:recipe, name: 'Mai Tai') }
  let!(:mt1_access) do
    create(:access, accessible: mai_tai, user: user2, status: 'PRIVATE')
  end
  let!(:p6ts1) { create(:tag_selection, taggable: mai_tai, tag: orgeat) }
  let!(:p6ts2) { create(:tag_selection, taggable: mai_tai, tag: rum) }
end
# rubocop: enable Metrics/BlockLength

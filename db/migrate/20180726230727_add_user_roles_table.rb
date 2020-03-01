class AddUserRolesTable < ActiveRecord::Migration[5.1]
  def change
    create_table :user_roles do |t|
      t.references :user, null: false
      t.references :role, null: false
      t.timestamps
    end
  end
end

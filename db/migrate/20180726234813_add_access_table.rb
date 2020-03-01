class AddAccessTable < ActiveRecord::Migration[5.1]
  def change
    create_table :accesses do |t|
      t.string :accessible_type, null: false
      t.integer :accessible_id, null: false
      t.integer :user_id
      t.string :status
      t.timestamps
    end
    add_index :accesses, :user_id
    add_index :accesses, %i[accessible_id accessible_type], unique: true
  end
end

module suilink::user {
    use std::string::String;
    use sui::dynamic_field;

    // User struct that stores name -> aboutObjectId mappings using dynamic fields
    public struct User has key {
        id: UID,
    }

    // Wrapper for storing aboutObjectId as a dynamic field value
    public struct AboutMapping has store, drop, copy {
        about_object_id: String,
    }

    // Create a new User object and transfer to sender
    public entry fun create(ctx: &mut TxContext) {
        let user = User {
            id: object::new(ctx),
        };
        transfer::transfer(user, tx_context::sender(ctx));
    }

    // Add or update a name -> aboutObjectId mapping
    public entry fun add_about(
        user: &mut User,
        name: String,
        about_object_id: String,
    ) {
        // Check if the name already exists and remove it
        if (dynamic_field::exists_with_type<String, AboutMapping>(&user.id, name)) {
            let _old: AboutMapping = dynamic_field::remove(&mut user.id, name);
        };

        // Add the new mapping
        let mapping = AboutMapping {
            about_object_id,
        };
        dynamic_field::add(&mut user.id, name, mapping);
    }

    // Get aboutObjectId by name
    public fun get_about_id(user: &User, name: String): String {
        let mapping = dynamic_field::borrow<String, AboutMapping>(&user.id, name);
        mapping.about_object_id
    }
}

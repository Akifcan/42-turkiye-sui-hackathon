module suilink::registry {
    use std::string::String;
    use sui::dynamic_field;

    // Global shared registry for name -> aboutObjectId mappings
    public struct Registry has key {
        id: UID,
    }

    // Wrapper for aboutObjectId
    public struct AboutMapping has store, drop, copy {
        about_object_id: ID,
    }

    // Initialize - creates the global registry
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
        };
        transfer::share_object(registry);
    }

    // Register a name with aboutObjectId
    public entry fun register(
        registry: &mut Registry,
        name: String,
        about_object_id: ID,
    ) {
        // Check if name already exists and remove it
        if (dynamic_field::exists_with_type<String, AboutMapping>(&registry.id, name)) {
            let _old: AboutMapping = dynamic_field::remove(&mut registry.id, name);
        };

        // Add new mapping
        let mapping = AboutMapping {
            about_object_id,
        };
        dynamic_field::add(&mut registry.id, name, mapping);
    }

    // Get aboutObjectId by name
    public fun get_about_id(registry: &Registry, name: String): ID {
        let mapping = dynamic_field::borrow<String, AboutMapping>(&registry.id, name);
        mapping.about_object_id
    }

    // Check if name exists
    public fun has_name(registry: &Registry, name: String): bool {
        dynamic_field::exists_with_type<String, AboutMapping>(&registry.id, name)
    }

    // Remove a name registration
    public entry fun unregister(
        registry: &mut Registry,
        name: String,
    ) {
        let _mapping: AboutMapping = dynamic_field::remove(&mut registry.id, name);
    }
}

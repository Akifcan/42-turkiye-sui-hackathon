module suilink::about {
    use std::string::String;

    // Struct to store user's about information
    public struct About has key, store {
        id: UID,
        name: String,
        lastname: String,
        website: String,
        about: String,
    }

    // Create a new About object and transfer to sender
    public entry fun create(
        name: String,
        lastname: String,
        website: String,
        about: String,
        ctx: &mut TxContext
    ) {
        let about_obj = About {
            id: object::new(ctx),
            name,
            lastname,
            website,
            about,
        };
        transfer::transfer(about_obj, tx_context::sender(ctx));
    }
}

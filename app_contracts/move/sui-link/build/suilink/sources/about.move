#[allow(duplicate_alias)]
module suilink::about {
    use std::string::String;
    use sui::object;
    use sui::tx_context;
    use sui::transfer;

    /// User profile struct containing personal information
    public struct UserProfile has key, store {
        id: object::UID,
        name: String,
        lastname: String,
        email: String,
        website: String,
        about: String,
    }

    /// Create a new user profile
    public entry fun create_profile(
        name: String,
        lastname: String,
        email: String,
        website: String,
        about: String,
        ctx: &mut tx_context::TxContext
    ) {
        let profile = UserProfile {
            id: object::new(ctx),
            name,
            lastname,
            email,
            website,
            about,
        };
        transfer::transfer(profile, tx_context::sender(ctx));
    }

    /// Update existing profile information
    public entry fun update_profile(
        profile: &mut UserProfile,
        name: String,
        lastname: String,
        email: String,
        website: String,
        about: String,
    ) {
        profile.name = name;
        profile.lastname = lastname;
        profile.email = email;
        profile.website = website;
        profile.about = about;
    }

    // === Getter Functions ===

    /// Get all profile information at once
    /// Returns (name, lastname, email, website, about)
    public fun get_profile_info(profile: &UserProfile): (String, String, String, String, String) {
        (
            profile.name,
            profile.lastname,
            profile.email,
            profile.website,
            profile.about
        )
    }

    /// Get user's first name
    public fun get_name(profile: &UserProfile): String {
        profile.name
    }

    /// Get user's last name
    public fun get_lastname(profile: &UserProfile): String {
        profile.lastname
    }

    /// Get user's email
    public fun get_email(profile: &UserProfile): String {
        profile.email
    }

    /// Get user's website
    public fun get_website(profile: &UserProfile): String {
        profile.website
    }

    /// Get user's about information
    public fun get_about(profile: &UserProfile): String {
        profile.about
    }
}

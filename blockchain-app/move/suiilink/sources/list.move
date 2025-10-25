module suilink::list {
    use std::string::String;
    use sui::dynamic_field;

    // Social link struct
    public struct SocialLink has store, drop, copy {
        sitename: String,
        siteurl: String,
        description: String,
        iconurl: String,
    }

    // List of social links
    public struct SocialLinkList has store, drop, copy {
        links: vector<SocialLink>,
    }

    // Global shared registry for name -> SocialLinkList mappings
    public struct ListRegistry has key {
        id: UID,
    }

    // Initialize - creates the global list registry
    fun init(ctx: &mut TxContext) {
        let registry = ListRegistry {
            id: object::new(ctx),
        };
        transfer::share_object(registry);
    }

    // Add a link to user's list (creates list if doesn't exist)
    public entry fun add_link(
        registry: &mut ListRegistry,
        name: String,
        sitename: String,
        siteurl: String,
        description: String,
        iconurl: String,
    ) {
        let new_link = SocialLink {
            sitename,
            siteurl,
            description,
            iconurl,
        };

        // Check if user already has a list
        if (dynamic_field::exists_with_type<String, SocialLinkList>(&registry.id, name)) {
            // Get existing list, add new link, and update
            let list = dynamic_field::borrow_mut<String, SocialLinkList>(&mut registry.id, name);
            vector::push_back(&mut list.links, new_link);
        } else {
            // Create new list with the link
            let mut links = vector::empty<SocialLink>();
            vector::push_back(&mut links, new_link);

            let link_list = SocialLinkList {
                links,
            };

            dynamic_field::add(&mut registry.id, name, link_list);
        };
    }

    // Get all links for a user
    public fun get_links(registry: &ListRegistry, name: String): vector<SocialLink> {
        let list = dynamic_field::borrow<String, SocialLinkList>(&registry.id, name);
        list.links
    }

    // Check if user has a list
    public fun has_list(registry: &ListRegistry, name: String): bool {
        dynamic_field::exists_with_type<String, SocialLinkList>(&registry.id, name)
    }

    // Get number of links for a user
    public fun get_link_count(registry: &ListRegistry, name: String): u64 {
        if (!has_list(registry, name)) {
            return 0
        };
        let list = dynamic_field::borrow<String, SocialLinkList>(&registry.id, name);
        vector::length(&list.links)
    }

    // Remove all links for a user
    public entry fun clear_links(
        registry: &mut ListRegistry,
        name: String,
    ) {
        let _list: SocialLinkList = dynamic_field::remove(&mut registry.id, name);
    }

    // Getter functions for SocialLink
    public fun get_sitename(link: &SocialLink): String {
        link.sitename
    }

    public fun get_siteurl(link: &SocialLink): String {
        link.siteurl
    }

    public fun get_description(link: &SocialLink): String {
        link.description
    }

    public fun get_iconurl(link: &SocialLink): String {
        link.iconurl
    }
}

module suilink::list {
    use std::string::String;

    // Link structure with URL, title, description, and site URL
    public struct Link has store, copy, drop {
        url: String,
        title: String,
        description: String,
        site_url: String,
    }

    // LinkList - a shared object containing an array of links
    public struct LinkList has key, store {
        id: UID,
        links: vector<Link>,
        owner: address,
    }

    // Create a new link list and share it
    public entry fun create_list(ctx: &mut TxContext) {
        let list = LinkList {
            id: object::new(ctx),
            links: vector::empty(),
            owner: tx_context::sender(ctx),
        };
        transfer::share_object(list);
    }

    // Add a link to the list
    public entry fun add_link(
        list: &mut LinkList,
        url: String,
        title: String,
        description: String,
        site_url: String,
        ctx: &TxContext
    ) {
        assert!(list.owner == tx_context::sender(ctx), 0); // Only owner can add links

        let link = Link {
            url,
            title,
            description,
            site_url,
        };

        vector::push_back(&mut list.links, link);
    }

    // Get the number of links in the list
    public fun get_link_count(list: &LinkList): u64 {
        vector::length(&list.links)
    }

    // Get a specific link by index
    public fun get_link(list: &LinkList, index: u64): &Link {
        vector::borrow(&list.links, index)
    }
}

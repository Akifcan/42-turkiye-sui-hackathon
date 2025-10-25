module suilink::nft_list {
    use std::string::String;
    use sui::dynamic_field;

    // NFT item struct
    public struct NFTItem has store, drop, copy {
        nft_url: String,
        title: String,
        description: String,
    }

    // List of NFT items
    public struct NFTList has store, drop, copy {
        items: vector<NFTItem>,
    }

    // Global shared registry for name -> NFTList mappings
    public struct NFTRegistry has key {
        id: UID,
    }

    // Initialize - creates the global NFT registry
    fun init(ctx: &mut TxContext) {
        let registry = NFTRegistry {
            id: object::new(ctx),
        };
        transfer::share_object(registry);
    }

    // Add an NFT to user's list (creates list if doesn't exist)
    public entry fun add_nft(
        registry: &mut NFTRegistry,
        name: String,
        nft_url: String,
        title: String,
        description: String,
    ) {
        let new_nft = NFTItem {
            nft_url,
            title,
            description,
        };

        // Check if user already has a list
        if (dynamic_field::exists_with_type<String, NFTList>(&registry.id, name)) {
            // Get existing list, add new NFT, and update
            let list = dynamic_field::borrow_mut<String, NFTList>(&mut registry.id, name);
            vector::push_back(&mut list.items, new_nft);
        } else {
            // Create new list with the NFT
            let mut items = vector::empty<NFTItem>();
            vector::push_back(&mut items, new_nft);

            let nft_list = NFTList {
                items,
            };

            dynamic_field::add(&mut registry.id, name, nft_list);
        };
    }

    // Get all NFTs for a user
    public fun get_nfts(registry: &NFTRegistry, name: String): vector<NFTItem> {
        let list = dynamic_field::borrow<String, NFTList>(&registry.id, name);
        list.items
    }

    // Check if user has an NFT list
    public fun has_list(registry: &NFTRegistry, name: String): bool {
        dynamic_field::exists_with_type<String, NFTList>(&registry.id, name)
    }

    // Get number of NFTs for a user
    public fun get_nft_count(registry: &NFTRegistry, name: String): u64 {
        if (!has_list(registry, name)) {
            return 0
        };
        let list = dynamic_field::borrow<String, NFTList>(&registry.id, name);
        vector::length(&list.items)
    }

    // Remove all NFTs for a user
    public entry fun clear_nfts(
        registry: &mut NFTRegistry,
        name: String,
    ) {
        let _list: NFTList = dynamic_field::remove(&mut registry.id, name);
    }

    // Getter functions for NFTItem
    public fun get_nft_url(nft: &NFTItem): String {
        nft.nft_url
    }

    public fun get_title(nft: &NFTItem): String {
        nft.title
    }

    public fun get_description(nft: &NFTItem): String {
        nft.description
    }
}

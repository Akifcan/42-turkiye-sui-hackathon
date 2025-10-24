// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This module allows users to create and manage their link list (similar to Linktree)
module suilink::list {
  use std::string::String;
  use sui::table::{Self, Table};

  /// Individual link structure
  public struct Link has store, copy, drop {
    link: String,        // URL
    site_name: String,   // Site name
    icon_url: String,    // Icon URL
    description: String, // Link description
  }

  /// Global registry that stores all users' link lists
  public struct GlobalRegistry has key {
    id: UID,
    // Maps user address to their links
    user_links: Table<address, vector<Link>>,
  }

  /// Initialize the global registry when package is published
  /// This runs automatically only once during deployment
  fun init(ctx: &mut TxContext) {
    let registry = GlobalRegistry {
      id: object::new(ctx),
      user_links: table::new(ctx),
    };
    // Share the registry so everyone can access it
    transfer::share_object(registry);
  }

  /// Add a new link to the user's list in the global registry
  public entry fun add_link(
    registry: &mut GlobalRegistry,
    link: String,
    site_name: String,
    icon_url: String,
    description: String,
    ctx: &mut TxContext,
  ) {
    let sender = ctx.sender();
    let new_link = Link {
      link,
      site_name,
      icon_url,
      description,
    };

    // Check if user already has a link list
    if (table::contains(&registry.user_links, sender)) {
      let user_links = table::borrow_mut(&mut registry.user_links, sender);
      vector::push_back(user_links, new_link);
    } else {
      // Create new vector for first link
      let mut new_vector = vector::empty<Link>();
      vector::push_back(&mut new_vector, new_link);
      table::add(&mut registry.user_links, sender, new_vector);
    }
  }

  /// Get all links for a specific user
  public fun get_links(registry: &GlobalRegistry, user: address): vector<Link> {
    if (table::contains(&registry.user_links, user)) {
      *table::borrow(&registry.user_links, user)
    } else {
      vector::empty<Link>()
    }
  }

  /// Get the caller's own links
  public fun get_my_links(registry: &GlobalRegistry, ctx: &TxContext): vector<Link> {
    get_links(registry, ctx.sender())
  }
}

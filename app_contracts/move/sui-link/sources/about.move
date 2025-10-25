// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This module allows users to create and manage their personal profiles
module suilink::about {
  use std::string::{Self, String};
  use std::option::{Self, Option};
  use sui::table::{Self, Table};
  use sui::object::{Self, UID};
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};

  /// User profile structure containing personal information
  public struct Profile has store, copy, drop {
    name: String,           // First name
    surname: String,       // Last name
    phone_number: String,  // Phone number
    biography: String,     // Personal biography/description
    email: String,         // Email address
    website: String,       // Personal website
    location: String,      // Location/city
    birth_date: String,    // Birth date
  }

  /// Global registry that stores all users' profiles
  public struct ProfileRegistry has key {
    id: UID,
    // Maps user address to their profile
    user_profiles: Table<address, Profile>,
  }

  /// Initialize the profile registry when package is published
  /// This runs automatically only once during deployment
  fun init(ctx: &mut TxContext) {
    let registry = ProfileRegistry {
      id: object::new(ctx),
      user_profiles: table::new(ctx),
    };
    // Share the registry so everyone can access it
    transfer::share_object(registry);
  }

  /// Create a new profile for the user
  public fun create_profile(
    registry: &mut ProfileRegistry,
    name: String,
    surname: String,
    phone_number: String,
    biography: String,
    email: String,
    website: String,
    location: String,
    birth_date: String,
    ctx: &mut TxContext,
  ) {
    let sender = tx_context::sender(ctx);
    
    // Check if user already has a profile
    assert!(!table::contains(&registry.user_profiles, sender), 0);
    
    let new_profile = Profile {
      name,
      surname,
      phone_number,
      biography,
      email,
      website,
      location,
      birth_date,
    };

    table::add(&mut registry.user_profiles, sender, new_profile);
  }

  /// Update an existing profile
  public fun update_profile(
    registry: &mut ProfileRegistry,
    name: String,
    surname: String,
    phone_number: String,
    biography: String,
    email: String,
    website: String,
    location: String,
    birth_date: String,
    ctx: &mut TxContext,
  ) {
    let sender = tx_context::sender(ctx);
    
    // Check if user has a profile
    assert!(table::contains(&registry.user_profiles, sender), 1);
    
    let updated_profile = Profile {
      name,
      surname,
      phone_number,
      biography,
      email,
      website,
      location,
      birth_date,
    };

    let user_profile = table::borrow_mut(&mut registry.user_profiles, sender);
    *user_profile = updated_profile;
  }

  /// Get profile for a specific user
  public fun get_profile(registry: &ProfileRegistry, user: address): Option<Profile> {
    if (table::contains(&registry.user_profiles, user)) {
      option::some(*table::borrow(&registry.user_profiles, user))
    } else {
      option::none()
    }
  }

  /// Get the caller's own profile
  public fun get_my_profile(registry: &ProfileRegistry, ctx: &TxContext): Option<Profile> {
    get_profile(registry, tx_context::sender(ctx))
  }

  /// Check if a user has a profile
  public fun has_profile(registry: &ProfileRegistry, user: address): bool {
    table::contains(&registry.user_profiles, user)
  }

  /// Delete a user's profile
  public fun delete_profile(
    registry: &mut ProfileRegistry,
    ctx: &mut TxContext,
  ) {
    let sender = tx_context::sender(ctx);
    
    // Check if user has a profile
    assert!(table::contains(&registry.user_profiles, sender), 1);
    
    table::remove(&mut registry.user_profiles, sender);
  }

  /// Get only the name and surname of a user
  public fun get_name(registry: &ProfileRegistry, user: address): Option<String> {
    if (table::contains(&registry.user_profiles, user)) {
      let profile = table::borrow(&registry.user_profiles, user);
      let mut full_name = string::utf8(b"");
      string::append(&mut full_name, profile.name);
      string::append(&mut full_name, string::utf8(b" "));
      string::append(&mut full_name, profile.surname);
      option::some(full_name)
    } else {
      option::none()
    }
  }

  /// Get only the biography of a user
  public fun get_biography(registry: &ProfileRegistry, user: address): Option<String> {
    if (table::contains(&registry.user_profiles, user)) {
      let profile = table::borrow(&registry.user_profiles, user);
      option::some(profile.biography)
    } else {
      option::none()
    }
  }
}

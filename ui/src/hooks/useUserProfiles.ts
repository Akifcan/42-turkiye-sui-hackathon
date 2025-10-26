import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '../types';
import { TESTNET_SUILINK_PACKAGE_ID, TESTNET_REGISTRY_ID } from '../constants';

export const useUserProfiles = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const userAddress = currentAccount?.address;

  return useQuery({
    queryKey: ['user-profiles', userAddress],
    queryFn: async () => {
      if (!userAddress) return [];

      try {
        // Step 1: Build reverse mapping from Registry (About ID -> username)
        const aboutIdToUsername = new Map<string, string>();
        
        try {
          console.log('Fetching Registry mappings...');
          let hasNextPage = true;
          let cursor: string | null | undefined = null;
          
          // Fetch all dynamic fields from Registry with pagination
          while (hasNextPage) {
            const dynamicFieldsPage = await suiClient.getDynamicFields({
              parentId: TESTNET_REGISTRY_ID,
              cursor,
            });
            
            // Process each dynamic field
            for (const field of dynamicFieldsPage.data) {
              try {
                // Fetch the full dynamic field object to get the About ID
                const fieldObject = await suiClient.getDynamicFieldObject({
                  parentId: TESTNET_REGISTRY_ID,
                  name: field.name,
                });
                
                if (fieldObject.data?.content?.dataType === 'moveObject') {
                  const fieldContent = fieldObject.data.content as any;
                  const aboutObjectId = fieldContent.fields?.about_object_id;
                  
                  // Extract username from the field name
                  // The name is a String type in Move, which gets encoded
                  if (field.name?.type === 'std::string::String' || field.name?.type === '0x1::string::String') {
                    const username = field.name?.value;
                    if (username && aboutObjectId && typeof username === 'string') {
                      aboutIdToUsername.set(aboutObjectId, username);
                    }
                  }
                }
              } catch (fieldError) {
                console.warn('Error fetching dynamic field:', field, fieldError);
              }
            }
            
            hasNextPage = dynamicFieldsPage.hasNextPage;
            cursor = dynamicFieldsPage.nextCursor;
          }
          
          console.log(`✅ Built reverse mapping with ${aboutIdToUsername.size} entries`);
        } catch (registryError) {
          console.warn('⚠️ Could not fetch Registry mappings:', registryError);
          // Continue without usernames rather than failing completely
        }

        // Step 2: Fetch all About objects owned by the user
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: userAddress,
          filter: {
            StructType: `${TESTNET_SUILINK_PACKAGE_ID}::about::About`
          },
          options: {
            showContent: true,
            showType: true,
          }
        });

        // Step 3: Parse each About object
        const profilePromises = ownedObjects.data.map(async (obj) => {
          if (obj.data?.content?.dataType !== 'moveObject') return null;

          const content = obj.data.content as any;
          const fields = content?.fields || {};
          const objectId = obj.data.objectId;

          // Fetch dynamic fields (social_links and nft_gallery)
          let socialLinks: any[] = [];
          let nftGallery: any[] = [];
          let profilePhotoNft: string | null = null;

          try {
            // Get social links dynamic field
            console.log(`🔗 [useUserProfiles] Fetching social links for profile ${objectId}...`);
            const socialLinksField = await suiClient.getDynamicFieldObject({
              parentId: objectId,
              name: {
                type: 'vector<u8>',
                value: Array.from(new TextEncoder().encode('social_links'))
              }
            });

            console.log(`🔗 [useUserProfiles] Social links field result:`, socialLinksField);

            if (socialLinksField.data?.content?.dataType === 'moveObject') {
              const linksData = (socialLinksField.data.content as any).fields?.value || [];
              socialLinks = linksData;
              console.log(`✅ [useUserProfiles] Found ${socialLinks.length} social links for profile ${objectId}`);
            } else {
              console.log(`⚠️ [useUserProfiles] Social links field exists but is not a moveObject for profile ${objectId}`);
            }
          } catch (e) {
            console.log(`⚠️ [useUserProfiles] No social links found for profile ${objectId}:`, e);
          }

          try {
            // Get NFT gallery dynamic field
            const nftGalleryField = await suiClient.getDynamicFieldObject({
              parentId: objectId,
              name: {
                type: 'vector<u8>',
                value: Array.from(new TextEncoder().encode('nft_gallery'))
              }
            });

            if (nftGalleryField.data?.content?.dataType === 'moveObject') {
              const galleryData = (nftGalleryField.data.content as any).fields?.value || [];
              nftGallery = galleryData;
            }
          } catch (e) {
            console.log('No NFT gallery found for profile', objectId);
          }

          // Extract profile photo NFT
          if (fields.profile_photo_nft?.fields?.vec?.[0]) {
            profilePhotoNft = fields.profile_photo_nft.fields.vec[0];
          }

          // Helper function to decode byte arrays to strings
          const decodeString = (value: any): string => {
            if (!value) return "";
            if (typeof value === "string") return value;
            if (Array.isArray(value)) {
              try {
                return new TextDecoder().decode(new Uint8Array(value));
              } catch (e) {
                return "";
              }
            }
            return String(value);
          };

          // Look up registered username from our reverse mapping
          const registeredUsername = aboutIdToUsername.get(objectId);

          const profile: UserProfile = {
            objectId,
            name: decodeString(fields.name),
            lastname: decodeString(fields.lastname),
            website: decodeString(fields.website),
            about: decodeString(fields.about),
            profilePhotoNft,
            socialLinks: socialLinks.map((link: any) => {
              // Handle both formats: link might have a 'fields' property or be a plain object
              const linkFields = link.fields || link;
              return {
                sitename: decodeString(linkFields.sitename),
                siteurl: decodeString(linkFields.siteurl),
                description: decodeString(linkFields.description),
                iconurl: decodeString(linkFields.iconurl),
              };
            }),
            nftGallery: nftGallery.map((item: any) => {
              // Handle both formats: item might have a 'fields' property or be a plain object
              const itemFields = item.fields || item;
              return {
                nft_url: decodeString(itemFields.nft_url),
                title: decodeString(itemFields.title),
                description: decodeString(itemFields.description),
              };
            }),
            registeredUsername,
          };
          
          console.log(`📝 [useUserProfiles] Profile "${profile.name} ${profile.lastname}"${registeredUsername ? ` (@${registeredUsername})` : ''} - About ID: ${objectId}`);
          console.log(`📝 [useUserProfiles] → Social Links: ${profile.socialLinks.length} links`, profile.socialLinks);
          console.log(`📝 [useUserProfiles] → NFT Gallery: ${profile.nftGallery.length} NFTs`);
          
          return profile;
        });

        const profiles = await Promise.all(profilePromises);
        return profiles.filter(p => p !== null) as UserProfile[];
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        return [];
      }
    },
    enabled: !!userAddress,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 1,
  });
};

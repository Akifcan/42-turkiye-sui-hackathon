import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAthleteNFTs } from '../../hooks/useAthleteNFTs';
import { useListNFT } from '../../hooks/useListNFT';
import { useUnlistNFT } from '../../hooks/useUnlistNFT';
import { useMyNFTCopies } from '../../hooks/useMyNFTCopies';
import { useNFTGallery } from '../../hooks/useNFTGallery';
import { useProfileContext } from '../../contexts/ProfileContext';
import { CreateNFTModal } from './modals/CreateNFTModal';
import { InlineNFTGalleryEditor } from './inline-editors/InlineNFTGalleryEditor';
import { SUI_DECIMALS } from '../../constants';

export const NFTsManager: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { selectedProfile, refreshProfiles } = useProfileContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  const { data: createdNFTs, isLoading: isLoadingCreated, refetch: refetchCreated } = useAthleteNFTs(
    currentAccount?.address || ''
  );
  const { data: ownedNFTs, isLoading: isLoadingOwned } = useMyNFTCopies(
    currentAccount?.address || null
  );

  const { listNFT, isPending: isListing } = useListNFT(() => {
    setTimeout(() => refetchCreated(), 2000);
  });

  const { unlistNFT, isPending: isUnlisting } = useUnlistNFT(() => {
    setTimeout(() => refetchCreated(), 2000);
  });

  const { removeNFTGalleryItem } = useNFTGallery(() => {
    refreshProfiles();
  });

  const handlePriceChange = (nftId: string, value: string) => {
    setPriceInputs((prev) => ({ ...prev, [nftId]: value }));
  };

  const handleList = async (nftId: string) => {
    const priceInSui = priceInputs[nftId];
    if (!priceInSui || parseFloat(priceInSui) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const priceInMist = Math.floor(parseFloat(priceInSui) * Math.pow(10, SUI_DECIMALS));
    await listNFT(nftId, priceInMist.toString());
  };

  const handleUnlist = async (nftId: string) => {
    await unlistNFT(nftId);
  };

  const handleRemoveGalleryItem = async (index: number) => {
    if (selectedProfile && confirm('Are you sure you want to remove this gallery item?')) {
      await removeNFTGalleryItem(selectedProfile.objectId, index);
    }
  };

  if (!currentAccount) {
    return (
      <Card>
        <div style={{ padding: 'var(--spacing-m)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Connect your wallet to manage NFTs
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
      {/* Create NFT Section */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 'var(--font-weight-bold)' }}>
                Create NFT
              </h3>
              <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                Create new NFTs to sell to your supporters
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="accent">
              Create New NFT
            </Button>
          </div>
        </div>
      </Card>

      {/* My Created NFTs Section */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 'var(--font-weight-bold)' }}>
              My Created NFTs
            </h3>
            <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
              Manage pricing and availability of your NFTs
            </p>
          </div>

          {isLoadingCreated ? (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Loading NFTs...</p>
            </div>
          ) : !createdNFTs || createdNFTs.length === 0 ? (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                You haven't created any NFTs yet. Click "Create New NFT" to get started!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '10px',
              }}
            >
              {createdNFTs.map((nft) => (
                <div
                  key={nft.id}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-s)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300x300?text=NFT';
                    }}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-s)',
                    }}
                  />

                  <div>
                    <h4
                      style={{
                        margin: 0,
                        color: 'var(--color-text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {nft.name}
                    </h4>
                    {nft.description && (
                      <p
                        style={{
                          margin: '2px 0 0 0',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {nft.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '4px 6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-s)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Total Sold: {nft.total_sold}
                    </div>
                  </div>

                  {nft.for_sale ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-s)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--color-brand-primary)',
                            fontWeight: 'var(--font-weight-bold)',
                            fontSize: '0.75rem',
                          }}
                        >
                          Listed for {(parseInt(nft.price) / Math.pow(10, SUI_DECIMALS)).toFixed(4)} SUI
                        </span>
                      </div>
                      <Button
                        onClick={() => handleUnlist(nft.id)}
                        loading={isUnlisting}
                        variant="secondary"
                      >
                        Unlist NFT
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <Input
                        label="Price (SUI)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={priceInputs[nft.id] || ''}
                        onChange={(e) => handlePriceChange(nft.id, e.target.value)}
                        disabled={isListing}
                      />
                      <Button
                        onClick={() => handleList(nft.id)}
                        loading={isListing}
                        variant="accent"
                      >
                        List for Sale
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* My NFT Collection Section */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 'var(--font-weight-bold)' }}>
              My NFT Collection
            </h3>
            <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
              NFT copies you've purchased from athletes
            </p>
          </div>

          {isLoadingOwned ? (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Loading collection...</p>
            </div>
          ) : !ownedNFTs || ownedNFTs.length === 0 ? (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                You haven't purchased any NFTs yet. Visit athlete profiles to buy NFTs!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px',
              }}
            >
              {ownedNFTs.map((nft) => (
                <div
                  key={nft.id}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-s)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300x300?text=NFT';
                    }}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-s)',
                    }}
                  />

                  <div>
                    <h4
                      style={{
                        margin: 0,
                        color: 'var(--color-text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {nft.name}
                    </h4>
                    {nft.description && (
                      <p
                        style={{
                          margin: '2px 0 0 0',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {nft.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-s)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Copy #{nft.copy_number}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-brand-primary)',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      Owned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* NFT Gallery Section */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 'var(--font-weight-bold)' }}>
                NFT Gallery {selectedProfile && `(${selectedProfile.nftGallery.length})`}
              </h3>
              <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                Showcase your NFT collection on your profile
              </p>
            </div>
            {!isAddingGalleryItem && selectedProfile && (
              <Button onClick={() => setIsAddingGalleryItem(true)} variant="accent">
                Add Item
              </Button>
            )}
          </div>

          {/* Add Gallery Item Form */}
          {isAddingGalleryItem && (
            <InlineNFTGalleryEditor onClose={() => setIsAddingGalleryItem(false)} />
          )}

          {/* Gallery Items Grid */}
          {selectedProfile && selectedProfile.nftGallery.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '8px',
              }}
            >
              {selectedProfile.nftGallery.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-s)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                  <Button onClick={() => handleRemoveGalleryItem(index)} variant="secondary">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedProfile && selectedProfile.nftGallery.length === 0 && !isAddingGalleryItem && (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                No gallery items yet. Click "Add Item" to showcase NFTs on your profile.
              </p>
            </div>
          )}

          {!selectedProfile && (
            <div style={{ padding: 'var(--spacing-s)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                Select a profile to manage your NFT gallery
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Create NFT Modal */}
      <CreateNFTModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default NFTsManager;


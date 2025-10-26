graph TD
    subgraph "Ziyaretçinin Tarayıcısı (React Uygulaması)"
        A["<b>1. Ziyaretçi Adresi Yazar</b><br>Tarayıcıya `https://trwal.app/sarah-chen` girilir."]
        F["<b>5. Ana AthliFi Uygulaması Yüklenir</b><br>Tarayıcı, portaldan gelen ana React uygulamasını çalıştırır."]
        G["<b>6. React Router, URL'i Ayrıştırır</b><br>Adres çubuğundan 'sarah-chen' bilgisini yakalar."]
        J["<b>9. React, Sporcu Profilini Sorgular</b><br>Aldığı ID ile RPC isteği: 'Bu ID'nin herkese açık verilerini getir.'"]
        K["<b>11. Sayfanın Herkese Açık Hali Oluşturulur</b><br>React, sporcunun verilerini (bio, public_links, donation_threshold) render eder."]
        L{"<b>12. Ziyaretçi Cüzdanını Bağlar mı?</b>"}
        
        %% Donation Akışı
        M["<b>13. Donation Widget Gösterilir</b><br>Ziyaretçi SUI bağışı yapabilir"]
        S["<b>14. Taraftar 'Donate' Tıklar</b><br>Bağış miktarı: örn. 5 SUI"]
        T["<b>15. PTB Oluşturulur</b><br>1. Split coin (5 SUI)<br>2. Transfer → Sporcu<br>3. Transaction metadata"]
        U["<b>16. Cüzdan İmzası İstenir</b><br>Kullanıcı transaction'ı onaylar"]
        V["<b>17. Transaction Execute Edilir</b><br>Sui Blockchain'de işlem gerçekleşir"]
        W["<b>18. Donation Başarılı! 🎉</b><br>- SUI sporcuya transfer edildi<br>- İşlem blockchain'de kayıtlı<br>- Thank You modal gösterilir"]
    end

    subgraph "TRWal Portal (Ana Uygulama Sunucusu)"
        B["<b>2. İstek Portala Ulaşır</b><br>`trwal.app` sunucusu isteği alır."]
        C["<b>3. Portal, Walrus'u Sorgular</b><br>Ana AthliFi Site Objesi'nin dosyalarını ister."]
        E["<b>4. Portal, Uygulama Dosyalarını Sunar</b><br>HTML, JS, CSS → Ziyaretçiye"]
    end

    subgraph "Sui Blockchain (On-Chain Veri Katmanı)"
        D["<b>Walrus Depolama</b><br>React app kod dosyaları"]
        I["<b>Registry Objesi</b><br>Dynamic Fields: username → profile_id"]
        H["<b>About Objesi (Profile)</b><br>name, bio, links, donation_threshold"]
        SUPPORTER_WALLET["<b>Taraftarın Cüzdanı</b><br>SUI coins"]
        ATHLETE_WALLET["<b>Sporcunun Cüzdanı</b><br>SUI coins (donations)"]
    end

    %% --- AKIŞ 1: Sayfa Yükleme ---
    A --> B --> C --> D
    D -- "Ana uygulama dosyaları" --> E --> F
    F --> G
    G -- "Username → Profile ID?" --> I
    I -- "Profile ID: 0x123" --> J
    J --> H
    H -- "Profile data" --> K

    %% --- AKIŞ 2: Donation Flow ---
    K --> L
    L -- "Evet" --> M
    M --> S
    S --> T
    T --> U
    U --> V
    V -- "Transfer SUI" --> ATHLETE_WALLET
    SUPPORTER_WALLET -- "Payment source" --> V
    V --> W

    %% Styling
    style W fill:#FFD700,stroke:#F57F17,stroke-width:3px
    style ATHLETE_WALLET fill:#90EE90,stroke:#2E7D32,stroke-width:2px

---

# AthliFi Sistem Mimarisi - Detaylı Açıklama

## 🎯 HACKATHON SCOPE - Mevcut Özellikler

Bu dokümantasyon **hackathon sırasında implement edilen özellikleri** gösterir.

**✅ Uygulanmış Özellikler:**
- On-chain profil sistemi (Registry + About objesi)
- Dinamik routing (`/:username`)
- Walrus Sites deployment
- SuiNS domain integration
- Donation sistemi (SUI transfer)
- Donation history tracking
- Top supporters leaderboard
- **Supporter Pass NFT minting (satın alma)** ⭐
- NFT price setting by athletes
- Unlimited NFT supply system

**🔮 Gelecek Özellikler (Post-Hackathon):**
- NFT-gated exclusive content (access control)
- NFT ownership verification for content unlock
- Exclusive content tab
- Tier-based access levels
- DAO governance
- Advanced analytics

---

## 📊 Üç Ana Akış

### 🔹 AKIŞ 1: Profil Görüntüleme (Adım 1-11)

**1. Kullanıcı URL'e gider**
```
https://trwal.app/sarah-chen
```

**2-5. Walrus'tan uygulama yüklenir**
- TRWal Portal isteği alır
- Walrus'a sorgu gönderir
- React uygulaması tarayıcıya servis edilir

**6-8. Username → Profile ID çözümlemesi**
```typescript
// React Router URL'i parse eder
const username = "sarah-chen"

// Registry'den profile ID'si alınır
const profileId = await registry.get_about_id(username)
// Returns: 0x123abc...
```

**9-11. Profil verisi render edilir**
```typescript
// About objesi chain'den çekilir
const profile = await suiClient.getObject(profileId)

// Sayfa render edilir:
// - Bio
// - Social links
// - NFT gallery
// - Donation widget
```

---

### 🔹 AKIŞ 2: Donation Flow (Adım 12-18)

**12. Kullanıcı cüzdanını bağlar**
```typescript
// dApp Kit ile wallet connect
const currentAccount = useCurrentAccount()
```

**13. Donation widget görüntülenir**
```typescript
<DonationWidget
  athleteAddress="0x..."
  athleteUsername="sarah-chen"
  profileId={profileId}
/>
```

**14. Kullanıcı donate butonuna tıklar**
```typescript
const sendDonation = async (amount: number) => {
  // Örnek: 5 SUI bağış
  const amountInMist = amount * 1_000_000_000
```

**15. Programmable Transaction Block (PTB) oluşturulur**
```typescript
const tx = new Transaction()

// 1. Coin'i split et (donation için)
const [coin] = tx.splitCoins(tx.gas, [
  tx.pure.u64(amountInMist)
])

// 2. Transfer to athlete
tx.transferObjects([coin], tx.pure.address(athleteAddress))
```

**16. Kullanıcı transaction'ı imzalar**
```typescript
// Wallet popup açılır
// Kullanıcı "Approve" tıklar
```

**17. Blockchain'de işlem gerçekleşir**
```typescript
const result = await signAndExecuteTransaction({
  transaction: tx,
})

// Transaction digest döner
```

**18. Success notification & history update**
```typescript
// Thank You modal gösterilir
<ThankYouModal
  amount={amount}
  athleteName="Sarah Chen"
  transactionDigest={result.digest}
/>

// Donation history yenilenir
// Top supporters leaderboard güncellenir
```

**Sonuçlar:**
- ✅ 5 SUI → Sarah'ın cüzdanına
- ✅ Transaction → Blockchain'de kayıtlı
- ✅ History → useDonationHistory hook ile query edilebilir
- ✅ Top Supporters → useTopSupporters hook ile gösterilir

---

### 🔹 AKIŞ 3: Supporter Pass NFT Satın Alma (Adım 19-26)

**19. Kullanıcı "Buy Supporter Pass" butonuna tıklar**
```typescript
// Athlete'in belirlediği pass price
const passPrice = 10 // SUI
const priceInMist = passPrice * 1_000_000_000
```

**20. Programmable Transaction Block (PTB) oluşturulur**
```typescript
const tx = new Transaction()

// 1. Coin'i split et (payment için)
const [payment] = tx.splitCoins(tx.gas, [
  tx.pure.u64(priceInMist)
])

// 2. supporter_pass::mint_supporter_pass() çağır
tx.moveCall({
  target: `${SUPPORTER_PASS_PACKAGE}::supporter_pass::mint_supporter_pass`,
  arguments: [
    tx.object(PASS_REGISTRY_ID),      // PassRegistry
    tx.pure.id(athleteProfileId),     // About object ID
    tx.pure.string(athleteUsername),  // "sarah-chen"
    payment,                           // 10 SUI payment
    tx.pure.address(athleteAddress),   // Sarah'ın wallet
  ],
})
```

**21. Kullanıcı transaction'ı imzalar**
```typescript
// Wallet popup açılır
// Kullanıcı "Approve" tıklar
const result = await signAndExecuteTransaction({
  transaction: tx,
})
```

**22. Blockchain'de işlem gerçekleşir**

**Move Contract (`supporter_pass.move`):**
```move
public entry fun mint_supporter_pass(
    registry: &mut PassRegistry,
    about_id: ID,
    username: String,
    payment: Coin<SUI>,
    athlete_address: address,
    ctx: &mut TxContext
) {
    // 1. PRICE VERIFICATION
    let config = dynamic_field::borrow_mut(&mut registry.id, about_id);
    let price = config.price;
    assert!(coin::value(&payment) >= price, E_INSUFFICIENT_PAYMENT);
    
    // 2. TRANSFER PAYMENT TO ATHLETE
    transfer::public_transfer(payment, athlete_address);
    // → Sarah'ın cüzdanına 10 SUI gider
    
    // 3. INCREMENT COUNTER
    config.total_minted = config.total_minted + 1;
    let pass_number = config.total_minted; // örn: 6
    
    // 4. MINT NFT
    let supporter = tx_context::sender(ctx);
    let nft = SupporterPassNFT {
        id: object::new(ctx),
        athlete_profile_id: about_id,      // 0x123abc...
        athlete_username: username,        // "sarah-chen"
        supporter_address: supporter,      // 0xdef456...
        mint_timestamp: tx_context::epoch(ctx),
        pass_number,                       // 6
    };
    
    // 5. EMIT EVENT
    event::emit(PassMinted {
        nft_id: object::id(&nft),
        athlete_profile_id: about_id,
        athlete_username: username,
        supporter_address: supporter,
        pass_number,
        timestamp: tx_context::epoch(ctx),
    });
    
    // 6. TRANSFER NFT TO SUPPORTER
    transfer::public_transfer(nft, supporter);
    // → NFT taraftarın cüzdanına gider
}
```

**23. Success notification**
```typescript
// Success modal gösterilir
<SuccessModal
  title="Supporter Pass Minted! 🎉"
  message={`You are now supporter #${passNumber} of ${athleteName}`}
  nftId={nftId}
  transactionDigest={result.digest}
/>
```

**Sonuçlar:**
- ✅ 10 SUI → Sarah'ın cüzdanına
- ✅ SupporterPassNFT → Taraftarın cüzdanına
- ✅ PassMinted event → Blockchain'de kayıtlı
- ✅ total_minted counter artırıldı (5 → 6)
- ⏭️ **Post-Hackathon:** NFT ile exclusive content unlock edilecek

---

## 🗄️ On-Chain Veri Yapıları

### Registry Objesi
```move
public struct Registry has key {
    id: UID,
    // Dynamic Fields:
    // username (String) -> about_id (ID)
    // Example: "sarah-chen" -> 0x123abc...
}
```

### About Objesi (Profile)
```move
public struct About has key, store {
    id: UID,
    name: String,              // "Sarah Chen"
    bio: String,               // Athlete bio
    profile_picture: String,   // URL or blob ID
    website: String,           // Personal website
    donation_threshold: u64,   // Minimum donation amount
    // Dynamic Fields:
    // - "links" -> LinkList
    // - "nft_list" -> NFTList
}
```

### LinkList (Social Links)
```move
public struct LinkList has key, store {
    id: UID,
    links: vector<Link>
}

public struct Link has store, drop {
    label: String,    // "Instagram"
    url: String,      // "https://instagram.com/sarah"
}
```

### NFTList (Gallery)
```move
public struct NFTList has key, store {
    id: UID,
    nfts: vector<NFTItem>
}

public struct NFTItem has store, drop {
    title: String,
    image_url: String,
    description: String,
}
```

### PassRegistry Objesi (Supporter Pass System)
```move
public struct PassRegistry has key {
    id: UID,
    // Dynamic Fields:
    // profile_id (0x123...) -> PassConfig {
    //   price: 10_000_000_000,
    //   total_minted: 6
    // }
}

public struct PassConfig has store {
    price: u64,           // 10 SUI (in MIST)
    total_minted: u64,    // Counter: 6
}
```

### SupporterPassNFT Objesi
```move
public struct SupporterPassNFT has key, store {
    id: UID,
    athlete_profile_id: ID,        // 0x123abc...
    athlete_username: String,      // "sarah-chen"
    supporter_address: address,    // 0xdef456...
    pass_number: u64,              // 6 (kaçıncı pass)
    mint_timestamp: u64,           // 1234567890
}
```

### PassMinted Event
```move
public struct PassMinted has copy, drop {
    nft_id: ID,
    athlete_profile_id: ID,
    athlete_username: String,
    supporter_address: address,
    pass_number: u64,
    timestamp: u64,
}
```

---

## 🔄 Frontend Query'leri

### 1. Profil Verisi Çekme
```typescript
// Username'den profile ID'yi al
const tx = new Transaction()
tx.moveCall({
  target: `${PACKAGE_ID}::registry::get_about_id`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.pure.string(username)
  ]
})

const result = await suiClient.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: dummyAddress
})

const profileId = parseReturnValue(result)
```

### 2. About Objesi Okuma
```typescript
const aboutObject = await suiClient.getObject({
  id: profileId,
  options: {
    showContent: true,
    showOwner: true
  }
})

const fields = aboutObject.data?.content?.fields
const profile = {
  name: fields.name,
  bio: fields.bio,
  profile_picture: fields.profile_picture,
  website: fields.website,
  donation_threshold: fields.donation_threshold
}
```

### 3. Donation History Query
```typescript
// Query transactions to/from athlete address
const txs = await suiClient.queryTransactionBlocks({
  filter: {
    ToAddress: athleteAddress
  },
  options: {
    showEffects: true,
    showInput: true,
    showBalanceChanges: true
  }
})

// Parse donation transactions
const donations = txs.data.map(tx => {
  const balanceChanges = tx.effects?.balanceChanges || []
  const suiReceived = balanceChanges.find(
    bc => bc.owner === athleteAddress && bc.coinType === '0x2::sui::SUI'
  )
  
  return {
    sender: tx.transaction.data.sender,
    amount: Math.abs(suiReceived?.amount || 0),
    timestamp: tx.timestampMs,
    digest: tx.digest
  }
})
```

### 4. Top Supporters Query
```typescript
// Aggregate donations by sender
const supporterMap = new Map()

donations.forEach(donation => {
  const current = supporterMap.get(donation.sender) || 0
  supporterMap.set(donation.sender, current + donation.amount)
})

// Sort by total donated
const topSupporters = Array.from(supporterMap.entries())
  .map(([address, total]) => ({ address, total }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 10)
```

### 5. Supporter Pass Price Query
```typescript
const tx = new Transaction()
tx.moveCall({
  target: `${SUPPORTER_PASS_PACKAGE}::supporter_pass::get_pass_price`,
  arguments: [
    tx.object(PASS_REGISTRY_ID),
    tx.pure.id(profileId)
  ]
})

const result = await suiClient.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: dummyAddress
})

const price = parseU64(result) // 10_000_000_000 (10 SUI in MIST)
```

### 6. Total Passes Minted Query
```typescript
const tx = new Transaction()
tx.moveCall({
  target: `${SUPPORTER_PASS_PACKAGE}::supporter_pass::get_total_minted`,
  arguments: [
    tx.object(PASS_REGISTRY_ID),
    tx.pure.id(profileId)
  ]
})

const result = await suiClient.devInspectTransactionBlock({
  transactionBlock: tx,
  sender: dummyAddress
})

const totalMinted = parseU64(result) // 6
```

### 7. PassMinted Events Query
```typescript
const events = await suiClient.queryEvents({
  query: {
    MoveEventType: `${SUPPORTER_PASS_PACKAGE}::supporter_pass::PassMinted`
  }
})

// Filter by athlete
const sarahPassEvents = events.data.filter(event =>
  event.parsedJson.athlete_username === "sarah-chen"
)

// Get supporters list
sarahPassEvents.forEach(event => {
  console.log(`Pass #${event.parsedJson.pass_number} minted by ${event.parsedJson.supporter_address}`)
})
```

---

## 💡 Temel Özellikler (Hackathon Version)

### ✅ On-Chain Profile System
- Username-based registry with dynamic fields
- Profile data stored on Sui blockchain
- Efficient lookup: username → profile_id

### ✅ Walrus Sites Deployment
- Frontend hosted on Walrus (decentralized storage)
- Served via TRWal Portal
- SuiNS domain integration

### ✅ Direct Donations
- Simple SUI transfers to athletes
- PTB-based transactions
- Real-time transaction history

### ✅ Donation Tracking
- Query blockchain for donation history
- Top supporters leaderboard
- Transparent on-chain records

### ✅ Gas Sponsorship
- Enoki-powered sponsored transactions
- User-friendly onboarding
- No gas fees for profile creation

### ✅ Supporter Pass NFT Minting
- Athletes can set NFT pass price
- Unlimited supply (no max_supply limit)
- Sequential numbering (Pass #1, #2, #3...)
- Atomic transaction: Payment + NFT mint
- PassMinted events for transparency
- NFT stored in supporter's wallet

---

## 🔐 Güvenlik

### Frontend Seviyesi
- Profile ownership queries
- Transaction validation
- User-friendly error handling

### Smart Contract Seviyesi
- Dynamic field access control
- Atomic operations (PTB)
- Owner-based transfers

---

## 📈 Scalability

- **Parallel Execution:** Her profile bağımsız obje
- **Dynamic Fields:** Efficient storage
- **No Global State:** No bottlenecks
- **Walrus Hosting:** Decentralized, scalable frontend

---

## 🎯 Kullanım Senaryoları (Hackathon Demo)

### Senaryo 1: Yeni Sporcu
```
1. Cüzdan bağla
2. "Create Profile" tıkla
3. Bio, links, NFT gallery ekle
4. Profil otomatik yayınlanır
5. username.trwal.app üzerinden erişilebilir
```

### Senaryo 2: Taraftar Bağışı
```
1. Sarah'ın profiline git (sarah-chen.trwal.app)
2. Profil bilgilerini gör
3. "Donate" butonuna tıkla
4. Miktar gir (örn: 5 SUI)
5. İşlemi onayla
6. Thank You modal ile onay
7. Donation history'de görün
```

### Senaryo 3: Sporcu Dashboard
```
1. Dashboard'a git
2. Mevcut profilini gör
3. Yeni link/NFT ekle
4. Donation threshold güncelle
5. Supporter Pass price set et (10 SUI)
6. Top supporters listesini kontrol et
```

### Senaryo 4: Supporter Pass Satın Alma
```
1. Sarah'ın profiline git
2. "Buy Supporter Pass" butonunu gör (10 SUI)
3. Satın al tıkla
4. Wallet'ta onayla
5. NFT mint edilir (Pass #6)
6. "You are now supporter #6!" mesajı
7. NFT cüzdanda görünür
8. (Post-Hackathon: Exclusive content unlock olacak)
```

### Senaryo 5: Sporcu Perspektifi
```
1. Pass price set et (10 SUI)
2. 10 kişi pass satın alır
3. 100 SUI gelir elde et
4. total_minted = 10
5. PassMinted event'lerinden supporters listesi gör
```

---

## 🔮 Gelecek Özellikler (Post-Hackathon Roadmap)

### Phase 1: NFT-Gated Content (Access Control)
- **✅ Supporter Pass NFT Minting:** DONE in Hackathon!
- **🔮 NFT Ownership Verification:** Check wallet for pass ownership
- **🔮 Exclusive Content Tab:** Unlock premium content for pass holders
- **🔮 Access Control Logic:** Frontend gating based on NFT ownership
- **🔮 Tier System:** Bronze/Silver/Gold passes with different access levels
- **🔮 Real-time Verification:** Dynamic content unlock

### Phase 2: Inner Circle DAO
- Weighted voting (NFT tier-based)
- Community proposals
- Treasury management
- Governance dashboard
- Milestone tracking

### Phase 3: Advanced Features
- Live events & streaming integration
- Mobile app (React Native)
- Analytics dashboard
- Multi-chain support
- E2E encrypted messaging
- Team/Club profiles

---

**🚀 Hackathon Version:**
- ✅ On-chain profiles + Walrus hosting
- ✅ Direct donations (no middleman)
- ✅ **Supporter Pass NFT minting** (unlimited supply)
- ✅ Pass price setting & event tracking

**🔮 Future Vision:**
- NFT-gated exclusive content (access control)
- DAO governance for communities
- Advanced features (mobile, analytics, streaming)
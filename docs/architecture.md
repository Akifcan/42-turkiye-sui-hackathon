graph TD
    subgraph "Ziyaretçinin Tarayıcısı (React Uygulaması)"
        A["<b>1. Ziyaretçi Adresi Yazar</b><br>Tarayıcıya `https://trwal.app/sarah-chen` girilir."]
        F["<b>5. Ana AthliFi Uygulaması Yüklenir</b><br>Tarayıcı, portaldan gelen ana React uygulamasını çalıştırır."]
        G["<b>6. React Router, URL'i Ayrıştırır</b><br>Adres çubuğundan 'sarah-chen' bilgisini yakalar."]
        J["<b>9. React, Sporcu Profilini Sorgular</b><br>Aldığı ID ile RPC isteği: 'Bu ID'nin herkese açık verilerini getir.'"]
        K["<b>11. Sayfanın Herkese Açık Hali Oluşturulur</b><br>React, sporcunun verilerini (bio, public_links, pass_price) render eder."]
        L{"<b>12. Ziyaretçi Cüzdanını Bağlar mı?</b>"}
        N["<b>14. NFT Ownership Check</b><br>RPC: 'Bu cüzdanda sarah-chen için <i>SupporterPassNFT</i> var mı?'"]
        P{"<b>NFT Bulundu mu?</b>"}
        Q["<b>✅ EVET: Exclusive Content Unlock ✅</b><br>'Exclusive' tab görünür hale gelir.<br>Sadece NFT sahiplerine özel içerik gösterilir."]
        R["<b>❌ HAYIR: Buy Pass Widget Göster ❌</b><br>'Buy Supporter Pass' butonu görünür.<br>Price: 10 SUI"]
        
        %% NFT Satın Alma Akışı
        S["<b>16. Taraftar 'Buy Pass' Tıklar</b><br>Pass fiyatı: 10 SUI"]
        T["<b>17. PTB Oluşturulur</b><br>1. Split coin (10 SUI)<br>2. Call mint_supporter_pass()<br>3. Payment → Sporcu<br>4. NFT → Taraftar"]
        U["<b>18. Cüzdan İmzası İstenir</b><br>Kullanıcı transaction'ı onaylar"]
        V["<b>19. Transaction Execute Edilir</b><br>Sui Blockchain'de işlem gerçekleşir"]
        W["<b>20. NFT Mint Başarılı! 🎉</b><br>- NFT cüzdana transfer edildi<br>- Para sporcuya gitti<br>- PassMinted event emit edildi"]
        X["<b>21. Sayfa Yenilenir</b><br>useNFTOwnership hook tekrar check eder"]
        Y["<b>22. Exclusive Content Açılır! 🔓</b><br>Artık 'Exclusive' tab erişilebilir"]
    end

    subgraph "TRWal Portal (Ana Uygulama Sunucusu)"
        B["<b>2. İstek Portala Ulaşır</b><br>`trwal.app` sunucusu isteği alır."]
        C["<b>3. Portal, Walrus'u Sorgular</b><br>Ana AthliFi Site Objesi'nin dosyalarını ister."]
        E["<b>4. Portal, Uygulama Dosyalarını Sunar</b><br>HTML, JS, CSS → Ziyaretçiye"]
    end

    subgraph "Sui Blockchain (On-Chain Veri Katmanı)"
        D["<b>Walrus Depolama</b><br>React app kod dosyaları"]
        I["<b>Registry Objesi</b><br>Dynamic Fields: username → profile_id"]
        H["<b>About Objesi (Profile)</b><br>name, bio, links, etc."]
        O["<b>Taraftarın Cüzdanı</b><br>SUI coins + NFT'ler"]
        
        %% Yeni objeler
        PASS_REG["<b>PassRegistry Objesi</b><br>Dynamic Fields: profile_id → PassConfig<br>(price: 10 SUI, total_minted: 5)"]
        PASS_CONTRACT["<b>supporter_pass.move</b><br>mint_supporter_pass()<br>set_pass_price()<br>NFT struct tanımları"]
        NFT_OBJ["<b>SupporterPassNFT Objesi</b><br>athlete_profile_id: 0x123<br>athlete_username: 'sarah-chen'<br>supporter_address: 0xabc<br>pass_number: 6<br>mint_timestamp: 1234567"]
        ATHLETE_WALLET["<b>Sporcunun Cüzdanı</b><br>SUI coins (donations + pass sales)"]
    end

    %% --- AKIŞ 1: Sayfa Yükleme ---
    A --> B --> C --> D
    D -- "Ana uygulama dosyaları" --> E --> F
    F --> G
    G -- "Username → Profile ID?" --> I
    I -- "Profile ID: 0x123" --> J
    J --> H
    H -- "Profile data" --> K

    %% --- AKIŞ 2: NFT Check ---
    K --> L
    L -- "Evet" --> N
    N --> O
    N --> PASS_REG
    O -- "getOwnedObjects()" --> P
    P -- "NFT var!" --> Q
    P -- "NFT yok!" --> R

    %% --- AKIŞ 3: NFT Satın Alma ---
    R --> S
    S --> T
    T --> U
    U --> V
    V --> PASS_CONTRACT
    PASS_CONTRACT -- "1. Verify payment" --> V
    PASS_CONTRACT -- "2. Transfer SUI" --> ATHLETE_WALLET
    PASS_CONTRACT -- "3. Mint NFT" --> NFT_OBJ
    NFT_OBJ -- "4. Transfer NFT" --> O
    PASS_CONTRACT -- "5. Emit event" --> W
    W --> X
    X --> N
    N --> Y

    %% Styling
    style Q fill:#90EE90,stroke:#2E7D32,stroke-width:3px
    style Y fill:#90EE90,stroke:#2E7D32,stroke-width:3px
    style W fill:#FFD700,stroke:#F57F17,stroke-width:3px
    style R fill:#FFA07A,stroke:#E64A19,stroke-width:2px
    style PASS_CONTRACT fill:#E1BEE7,stroke:#7B1FA2,stroke-width:2px
    style NFT_OBJ fill:#BBDEFB,stroke:#1976D2,stroke-width:2px

---

# AthliFi Sistem Mimarisi - Detaylı Açıklama

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
// - Supporter Pass price
```

---

### 🔹 AKIŞ 2: NFT Ownership Check (Adım 12-15)

**12. Kullanıcı cüzdanını bağlar**
```typescript
// dApp Kit ile wallet connect
const currentAccount = useCurrentAccount()
```

**13-14. NFT sahipliği kontrol edilir**
```typescript
// useNFTOwnership hook çalışır
const { hasPass, passNFT } = useNFTOwnership(profileId)

// Query: Bu cüzdanda sarah-chen için pass var mı?
const ownedNFTs = await suiClient.getOwnedObjects({
  owner: currentAccount.address,
  filter: {
    StructType: `${PACKAGE_ID}::supporter_pass::SupporterPassNFT`
  }
})

// Filter by athlete_profile_id
const hasSarahPass = ownedNFTs.data.some(nft => 
  nft.data.content.fields.athlete_profile_id === profileId
)
```

**15a. NFT VARSA ✅**
```typescript
// "Exclusive" tab görünür olur
<Tab active={hasPass}>Exclusive Content</Tab>

// Özel içerik gösterilir:
// - Private training videos
// - Personal journal entries  
// - Direct Q&A sessions
```

**15b. NFT YOKSA ❌**
```typescript
// "Buy Supporter Pass" widget gösterilir
<MintPassWidget
  price={10} // SUI
  athleteProfileId={profileId}
  athleteUsername="sarah-chen"
  athleteAddress="0x..."
/>
```

---

### 🔹 AKIŞ 3: Supporter Pass NFT Satın Alma (Adım 16-22)

**16. Kullanıcı "Buy Pass" butonuna tıklar**
```typescript
const mintPass = async () => {
  // Pass fiyatı: 10 SUI
  const price = 10_000_000_000 // MIST cinsinden
```

**17. Programmable Transaction Block (PTB) oluşturulur**
```typescript
const tx = new Transaction()

// 1. Coin'i split et (payment için)
const [payment] = tx.splitCoins(tx.gas, [
  tx.pure.u64(price)
])

// 2. supporter_pass::mint_supporter_pass() çağır
tx.moveCall({
  target: `${PACKAGE_ID}::supporter_pass::mint_supporter_pass`,
  arguments: [
    tx.object(PASS_REGISTRY_ID),      // PassRegistry
    tx.pure.id(profileId),             // About object ID
    tx.pure.string("sarah-chen"),     // Username
    payment,                           // 10 SUI payment
    tx.pure.address(athleteAddress),   // Sarah'ın wallet
  ],
})
```

**18. Kullanıcı transaction'ı imzalar**
```typescript
// Wallet popup açılır
// Kullanıcı "Approve" tıklar
```

**19-20. Blockchain'de işlem gerçekleşir**

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

**Sonuçlar:**
- ✅ 10 SUI → Sarah'ın cüzdanına
- ✅ SupporterPassNFT → Taraftarın cüzdanına
- ✅ PassMinted event → Blockchain'de kayıtlı
- ✅ total_minted counter artırıldı (5 → 6)

**21. Frontend yenilenir**
```typescript
// useNFTOwnership hook tekrar check eder
await refetch()

// Artık hasPass = true döner
```

**22. Exclusive Content unlock olur! 🎉**
```typescript
{hasPass && (
  <div className="exclusive-content">
    <h2>🔓 Welcome to the Inner Circle!</h2>
    <ExclusiveLinks links={exclusiveLinks} />
    <PrivateVideos videos={privateVideos} />
  </div>
)}
```

---

## 🗄️ On-Chain Veri Yapıları

### PassRegistry Objesi
```move
public struct PassRegistry has key {
    id: UID,
    // Dynamic Fields:
    // profile_id (0x123...) -> PassConfig {
    //   price: 10_000_000_000,
    //   total_minted: 6
    // }
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

### 2. Pass Price Sorgulama
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

const price = parseU64(result) // 10_000_000_000
```

### 3. Total Minted Sayısı
```typescript
const totalMinted = await queryTotalMinted(profileId)
// Returns: 6
```

### 4. NFT Ownership Kontrolü
```typescript
const ownedNFTs = await suiClient.getOwnedObjects({
  owner: userAddress,
  filter: {
    StructType: `${SUPPORTER_PASS_PACKAGE}::supporter_pass::SupporterPassNFT`
  },
  options: {
    showContent: true
  }
})

const hasSarahPass = ownedNFTs.data.some(nft => {
  const fields = nft.data?.content?.fields
  return fields?.athlete_profile_id === sarahProfileId
})
```

### 5. Pass Event'lerini Sorgulama
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

// Supporters listesi:
sarahPassEvents.forEach(event => {
  console.log(`Pass #${event.parsedJson.pass_number} minted by ${event.parsedJson.supporter_address}`)
})
```

---

## 💡 Temel Özellikler

### ✅ Sınırsız NFT Supply
- Her taraftar pass satın alabilir
- max_supply yok
- pass_number otomatik artar (1, 2, 3, ...)

### ✅ Atomik İşlem
- Para transfer + NFT mint tek transaction'da
- Fail safe: Ya her şey olur ya hiçbir şey

### ✅ Event Tracking
- Her mint PassMinted event emit eder
- Frontend event'leri query'leyerek supporters listesi oluşturabilir

### ✅ On-Chain Verification
- NFT ownership tamamen on-chain
- Frontend sadece query yapar, doğrulama blockchain'de

### ✅ Price Flexibility
- Her sporcu kendi fiyatını belirler
- set_pass_price() ile güncellenebilir

---

## 🔐 Güvenlik

### Frontend Seviyesi
- NFT ownership check → getOwnedObjects()
- athlete_profile_id match kontrolü
- Exclusive content conditional rendering

### Smart Contract Seviyesi
- Payment verification (assert!)
- Atomic operations (PTB)
- Event emission (transparency)
- Owner-based transfers

---

## 📈 Scalability

- **Parallel Execution:** Her profile bağımsız obje
- **Dynamic Fields:** Efficient storage
- **Event Indexing:** Fast queries
- **No Global State:** No bottlenecks

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Taraftar
```
1. Sarah'ın profiline git
2. "Buy Supporter Pass" gör (10 SUI)
3. Satın al
4. NFT mint edilir
5. "Exclusive" tab açılır
6. Özel içeriğe erişim
```

### Senaryo 2: Mevcut Pass Sahibi
```
1. Profili ziyaret et
2. Cüzdan otomatik check edilir
3. NFT bulunur
4. "Exclusive" tab zaten görünür
5. Direkt özel içeriğe eriş
```

### Senaryo 3: Sporcu Perspektifi
```
1. Pass price set et (10 SUI)
2. 10 kişi pass satın alır
3. 100 SUI gelir elde et
4. total_minted = 10
5. Event'lerden supporters listesi gör
```

---

**🚀 Sistem tamamen on-chain, decentralized ve ölçeklenebilir!**